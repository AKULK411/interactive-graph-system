import './Metric.css';

export default function Metric({ label, value, detail, title }) {
  return (
    <div className="nodeMetricCard__metric" title={title == null ? undefined : String(title)}>
      <dt>{label}</dt>
      <dd>{value}</dd>
      {detail && <small>{detail}</small>}
    </div>
  );
}
