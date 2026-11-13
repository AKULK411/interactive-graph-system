import Metric from "../Metric/Metric";
import { getNodeMetrics, formatBytes, formatNumber } from "../getNodeMetric";
import './NodeMetricCard.css';


export default function NodeMetricCard({ node }) {
  const metrics = getNodeMetrics(node);
  const name = node.name || "Без имени";
  const role = node.role || node.type || node.metadata?.role || "—";

  return (
    <article className="nodeMetricCard">
      <header className="nodeMetricCard__header">
        <strong title={name}>{name}</strong>
        <span title={role}>{role}</span>
      </header>
      <div className="nodeMetricCard__identity">
        <span title={String(node.id)}>ID: {node.id ?? "—"}</span>
        <time title={metrics.measuredAtRaw}>{metrics.measuredAt}</time>
      </div>
      <dl className="nodeMetricCard__grid">
        <Metric label="Статус" value={metrics.status} />
        <Metric label="CPU online" value={metrics.onlineCpus} />
        <Metric label="Нагрузка CPU" value={metrics.cpuUsage} />
        <Metric label="Память" value={metrics.memoryUsage} detail={metrics.memoryDetail} title={metrics.memoryTitle} />
        <Metric label="Получено байт" value={formatBytes(metrics.rxBytes)} title={metrics.rxBytes} />
        <Metric label="Отправлено байт" value={formatBytes(metrics.txBytes)} title={metrics.txBytes} />
        <Metric label="Полученные пакеты" value={formatNumber(metrics.rxPackets)} />
        <Metric label="Отправленные пакеты" value={formatNumber(metrics.txPackets)} />
      </dl>
    </article>
  );
}