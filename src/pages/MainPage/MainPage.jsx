import { useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

import './MainPage.css'

function getNodeId(endpoint) {
  return endpoint !== null && typeof endpoint === 'object' ? endpoint.id : endpoint;
}

export function markDeadNodes({ nodes, links }) {
  const connectedIds = links.reduce((ids, { source, target }) => {
    ids.add(getNodeId(source));
    ids.add(getNodeId(target));
    return ids;
  }, new Set());

  return {
    nodes: nodes.map((node) => ({
      ...node,
      color: connectedIds.has(node.id) ? (node.color ?? '#6b8ff7') : '#f05260',
    })),
    // Библиотека меняет свои узлы и связи, поэтому отдаём ей копии.
    links: links.map((link) => ({
      ...link,
      source: getNodeId(link.source),
      target: getNodeId(link.target),
    })),
  };
}

async function requestGraph(url, options) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Ошибка запроса: ${response.status}`);
  return body;
}

export default function MainPage() {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const canvasContainer = useRef(null);
  const [size, setSize] = useState({ width: 600, height: 600 });

  useEffect(() => {
    const controller = new AbortController();
    requestGraph('/api/graph', { signal: controller.signal })
      .then(setData)
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const element = canvasContainer.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const graphData = useMemo(() => data ? markDeadNodes(data) : null, [data]);
  const deadCount = useMemo(() => {
    if (!data) return 0;
    const ids = new Set(data.links.flatMap((link) => [getNodeId(link.source), getNodeId(link.target)]));
    return data.nodes.filter((node) => !ids.has(node.id)).length;
  }, [data]);

  async function addNode(name, targetId) {
    if (busy) return false;
    setBusy(true); setError(''); setNotice('');
    try {
      const updated = await requestGraph('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, targetId }),
      });
      setData(updated);
      setNotice(`Узел «${name}» добавлен и сохранён.`);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function deleteNode(node) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const updated = await requestGraph(`/api/nodes/${encodeURIComponent(node.id)}`, { method: 'DELETE' });
      setData(updated);
      setNotice(`Узел «${node.name}» и его связи удалены.`);
      setSelectedId('');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✳</span><span>GRAPH<span className="brand-light"> / LAB</span></span><span className="brand-version">01</span></div>
        <div className="sidebar-content">
          <div className="eyebrow"><span className="status-dot" /> РЕДАКТОР ГРАФА</div>
          <h1>Узлы и связи<span className="title-dot">.</span></h1>
          <p className="intro">Добавляйте узлы, создавайте связи и управляйте своим графом.</p>

          <AddNodeForm
            nodes={data?.nodes ?? []}
            disabled={!data || busy}
            onAdd={addNode}
          />
          <DeleteNodeForm
            nodes={data?.nodes ?? []}
            selectedId={selectedId}
            onSelect={setSelectedId}
            disabled={!data || busy}
            onDelete={deleteNode}
          />
          <div className="message" role="status" aria-live="polite">{error ? <span className="error">{error}</span> : notice}</div>
        </div>
        <div className="sidebar-footer"><span className="save-dot" /> Изменения сохраняются в data.json</div>
      </aside>
      <section className="workspace">
        <header className="topbar"><div><span className="breadcrumb">РАБОЧЕЕ ПРОСТРАНСТВО</span><span className="breadcrumb-divider">/</span><span className="breadcrumb-current">Обзор графа</span></div><span className="live"><span className="status-dot" /> LIVE</span></header>
        <div className="canvas-heading"><div><div className="eyebrow">ВИЗУАЛИЗАЦИЯ</div><h2>Ваш граф</h2><p>Нажмите на узел, чтобы выбрать его для удаления.</p></div><div className="heading-badge">ИНТЕРАКТИВНЫЙ ГРАФ <span>↗</span></div></div>
        <div className="graph-card" ref={canvasContainer}>
          <div className="graph-label"><span className="graph-label-icon">✳</span> ОБЛАСТЬ ГРАФА</div>
          {graphData && <ForceGraph2D graphData={graphData} width={size.width} height={size.height} nodeId="id" nodeLabel={(node) => `${node.name} · ${node.id}`} nodeVal="val" nodeColor="color" linkColor={() => 'rgba(135, 157, 201, 0.32)'} backgroundColor="rgba(0,0,0,0)" onNodeClick={(node) => { setSelectedId(node.id); setNotice(`Выбран узел «${node.name}».`); setError(''); }} />}
          {!graphData && <div className="loading">{error ? 'Не удалось загрузить граф' : 'Загружаем граф…'}</div>}
          <div className="graph-help"><span>↗</span> Прокручивайте для масштаба · Перетаскивайте для перемещения</div>
        </div>
        <div className="bottom-row"><div className="stats"><div><strong>{data?.nodes.length ?? '—'}</strong><span>УЗЛОВ</span></div><div><strong>{data?.links.length ?? '—'}</strong><span>СВЯЗЕЙ</span></div><div><strong className="red-count">{data ? deadCount : '—'}</strong><span>БЕЗ СВЯЗЕЙ</span></div></div><div className="legend"><span><i className="legend-dot blue" /> Со связями</span><span><i className="legend-dot red" /> Без связей</span></div></div>
      </section>
    </main>
  );
}