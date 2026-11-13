export function getNodeMetrics(node) {
  const currentCpu = node.cpu_stats || {};
  const previousCpu = node.precpu_stats || {};
  const memory = node.memory_stats || {};
  const demo = node.demo_metrics || {};
  const interfaces = Object.values(node.networks || {});
  const network = interfaces.reduce((sum, item) => ({
    rxBytes: sum.rxBytes + toNumber(item.rx_bytes),
    txBytes: sum.txBytes + toNumber(item.tx_bytes),
    rxPackets: sum.rxPackets + toNumber(item.rx_packets),
    txPackets: sum.txPackets + toNumber(item.tx_packets),
  }), { rxBytes: 0, txBytes: 0, rxPackets: 0, txPackets: 0 });
  const demoNetwork = demo.network_last_60s || {};

  const cpu = toNumberOrNull(demo.cpu_percent ?? node.cpu_percent)
    ?? calculateCpuPercent(currentCpu, previousCpu);
  const memoryPercent = toNumberOrNull(demo.memory_percent ?? node.memory_percent)
    ?? calculatePercent(memory.usage, memory.limit);
  const memoryUsageBytes = toNumberOrNull(memory.usage ?? demo.memory_usage_bytes ?? node.memory_usage_bytes);
  const memoryLimitBytes = toNumberOrNull(memory.limit ?? demo.memory_limit_bytes ?? node.memory_limit_bytes);
  const memoryText = memoryUsageBytes != null
    ? formatBytes(memoryUsageBytes)
    : memoryPercent == null
      ? "—"
      : `${memoryPercent.toFixed(1)}%`;
  const memoryDetail = memoryPercent == null
    ? null
    : `${memoryPercent.toFixed(1)}%${memoryLimitBytes ? ` из ${formatBytes(memoryLimitBytes)}` : ""}`;
  const memoryTitle = memoryUsageBytes != null
    ? `${formatNumber(memoryUsageBytes)} bytes${memoryLimitBytes != null ? ` / ${formatNumber(memoryLimitBytes)} bytes` : ""}`
    : memoryText;
  const rawStatus = String(node.status || "").toLowerCase();
  const status = ["running", "active", "online"].includes(rawStatus)
    ? "В сети"
    : ["exited", "inactive", "stopped", "offline"].includes(rawStatus) || Number(node.idle_time) > 0
      ? "Не в сети"
      : node.idle_time === 0
        ? "В сети"
        : node.status || "—";

  const timestamp = node.read || node.measurement_time || node.timestamp || node.generated_at;
  return {
    measuredAtRaw: timestamp || "",
    measuredAt: formatTimestamp(timestamp),
    status,
    onlineCpus: currentCpu.online_cpus ?? previousCpu.online_cpus ?? node.online_cpus ?? "—",
    cpuUsage: cpu == null ? "—" : `${cpu.toFixed(1)}%`,
    memoryUsage: memoryText,
    memoryDetail,
    memoryTitle,
    rxBytes: network.rxBytes || toNumber(demoNetwork.rx_bytes ?? node.rx_bytes),
    txBytes: network.txBytes || toNumber(demoNetwork.tx_bytes ?? node.tx_bytes),
    rxPackets: network.rxPackets || toNumber(node.rx_packets),
    txPackets: network.txPackets || toNumber(node.tx_packets),
  };
}

// Docker CPU% рассчитывается по текущему и предыдущему замеру.
function calculateCpuPercent(current, previous) {
  const cpuDelta = toNumberOrNull(current.cpu_usage?.total_usage)
    - toNumberOrNull(previous.cpu_usage?.total_usage);
  const systemDelta = toNumberOrNull(current.system_cpu_usage)
    - toNumberOrNull(previous.system_cpu_usage);
  if (!Number.isFinite(cpuDelta) || !Number.isFinite(systemDelta) || systemDelta <= 0 || cpuDelta < 0) return null;
  const cores = toNumber(current.online_cpus || previous.online_cpus || 1);
  return (cpuDelta / systemDelta) * cores * 100;
}

function calculatePercent(used, limit) {
  const usage = toNumberOrNull(used);
  const maximum = toNumberOrNull(limit);
  if (usage == null || maximum == null || maximum <= 0) return null;
  return (usage / maximum) * 100;
}

function toNumber(value) {
  return toNumberOrNull(value) || 0;
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatTimestamp(value) {
  if (!value) return "Время: —";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? `Время: ${value}`
    : `Время: ${date.toLocaleString("ru-RU")}`;
}

export function formatBytes(value) {
  const bytes = toNumber(value);
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function formatNumber(value) {
  return toNumber(value).toLocaleString("ru-RU");
}
