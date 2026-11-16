function endpointId(endpoint) {
  return endpoint !== null && typeof endpoint === "object" ? endpoint.id : endpoint;
}

export function createGraphData(graph) {
  const sourceCount = new Map();
  const targetCount = new Map();

  for (const link of graph.links) {
    const source = endpointId(link.source);
    const target = endpointId(link.target);
    sourceCount.set(source, (sourceCount.get(source) ?? 0) + 1);
    targetCount.set(target, (targetCount.get(target) ?? 0) + 1);
  }

  return {
    nodes: graph.nodes.map((node) => {
      const outgoing = sourceCount.get(node.id) ?? 0;
      const incoming = targetCount.get(node.id) ?? 0;
      return { ...node, val: outgoing + incoming, outgoing, incoming };
    }),
    links: graph.links.map((link) => ({ ...link })),
  };
}

function getNodeLoad(node) {
  const cpuStats = node.cpu_stats;
  const previousCpuStats = node.precpu_stats;
  const cpuUsage = cpuStats?.cpu_usage?.total_usage;
  const previousCpuUsage = previousCpuStats?.cpu_usage?.total_usage;
  const systemCpuUsage = cpuStats?.system_cpu_usage;
  const previousSystemCpuUsage = previousCpuStats?.system_cpu_usage;
  const onlineCpus =
    cpuStats?.online_cpus ?? cpuStats?.cpu_usage?.percpu_usage?.length;
  const memoryUsage = node.memory_stats?.usage;
  const memoryLimit = node.memory_stats?.limit;

  let cpuPercent = node.demo_metrics?.cpu_percent;
  if (!Number.isFinite(cpuPercent)) {
    const cpuDelta = cpuUsage - previousCpuUsage;
    const systemCpuDelta = systemCpuUsage - previousSystemCpuUsage;
    if (
      Number.isFinite(cpuDelta) &&
      Number.isFinite(systemCpuDelta) &&
      systemCpuDelta > 0 &&
      Number.isFinite(onlineCpus) &&
      onlineCpus > 0
    ) {
      cpuPercent = (cpuDelta / systemCpuDelta) * onlineCpus * 100;
    }
  }

  let memoryPercent = node.demo_metrics?.memory_percent;
  if (!Number.isFinite(memoryPercent) && Number.isFinite(memoryUsage) &&
      Number.isFinite(memoryLimit) && memoryLimit > 0) {
    memoryPercent = (memoryUsage / memoryLimit) * 100;
  }

  return {
    cpuPercent: Number.isFinite(cpuPercent) ? cpuPercent : null,
    memoryPercent: Number.isFinite(memoryPercent) ? memoryPercent : null,
  };
}

export function changeColor(node) {
  if (((node.incoming ?? 0) + (node.outgoing ?? 0) === 0)) return "black";
  const { cpuPercent, memoryPercent } = getNodeLoad(node);
  if (cpuPercent > 80 && memoryPercent > 80) return "red";
  if (cpuPercent > 60 && memoryPercent > 60) return "#ffac4d";
  if ((cpuPercent > 40 && memoryPercent>40)|| Math.max(cpuPercent ?? 0, memoryPercent ?? 0) > 40) return "#ffd000";
  if ((cpuPercent >10 && memoryPercent>10) || Math.max(cpuPercent ?? 0, memoryPercent ?? 0) > 10) return "#4caf50";
  if ((cpuPercent <10 && memoryPercent<10) || Math.max(cpuPercent ?? 0, memoryPercent ?? 0) === 0) return "#00a2ff";
  return "black";
  
}  

export const nodelabel = (node) => {
  const { cpuPercent, memoryPercent } = getNodeLoad(node);
  const hasLoadMetrics = cpuPercent !== null || memoryPercent !== null;
  const formattedCpu = cpuPercent === null ? "—" : `${cpuPercent.toFixed(1)}%`;
  const formattedMemory =
    memoryPercent === null ? "—" : `${memoryPercent.toFixed(1)}%`;
  const loadLabel = hasLoadMetrics
    ? `CPU ${formattedCpu} · память ${formattedMemory} · `
    : "";

  return `${node.name}: ${loadLabel}${node.outgoing} исходящих связей ${node.incoming} входящих связей`;
}

export function configureChargeForce(graph) {
  const chargeForce = graph?.d3Force("charge");
  if (!chargeForce) return;

  chargeForce.strength((node) => (node.val === 0 ? -5 : -30));
  graph.d3ReheatSimulation();
}
