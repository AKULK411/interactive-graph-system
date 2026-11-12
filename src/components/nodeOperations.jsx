import { useState } from "react";
import { addNode, deleteNode, getNodeInfo } from "./nodeOperationsUtils";

export default function NodeOperations({
  graph,
  onGraphChange,
  view,
  particleCount,
  onParticleCountChange,
  showArrows,
  onShowArrowsChange,
}) {
  const [selectedId, setSelectedId] = useState(() => (
    graph.nodes[0] ? String(graph.nodes[0].id) : ""
  ));
  const [nodeName, setNodeName] = useState("");
  const [connectToSelected, setConnectToSelected] = useState(true);
  const [error, setError] = useState("");
  const selectedNode = graph.nodes.find(node => String(node.id) === selectedId);
  const info = selectedNode ? getNodeInfo(graph, selectedNode.id) : null;

  function handleAddNode(event) {
    event.preventDefault();
    try {
      const { graph: updatedGraph, addedNode } = addNode(graph, {
        name: nodeName,
        targetId: connectToSelected && typeof selectedNode?.id === "string"
          ? selectedNode.id
          : null,
      });
      onGraphChange(updatedGraph);
      setSelectedId(String(addedNode.id));
      setNodeName("");
      setError("");
    } catch (operationError) {
      setError(operationError.message);
    }
  }

  function handleDeleteNode() {
    if (!selectedNode) return;
    try {
      const { graph: updatedGraph } = deleteNode(graph, selectedNode.id);
      onGraphChange(updatedGraph);
      const nextNode = updatedGraph.nodes[0];
      setSelectedId(nextNode ? String(nextNode.id) : "");
      setError("");
    } catch (operationError) {
      setError(operationError.message);
    }
  }

  return (
    <div className="nodeOperations">
      {view === "2D" && (
        <section className="editorSection" aria-label="Настройки графа 2D">
          <h3 className="editorSection__title">Настройки 2D</h3>
          <label className="editorField">
            <span className="editorField__label">Шарики на связях: {particleCount}</span>
            <input
              className="nodeOperations__range"
              type="range"
              min="0"
              max="5"
              step="1"
              value={particleCount}
              onChange={(event) => onParticleCountChange(Number(event.target.value))}
            />
          </label>
          <label className="switch">
            <input
              type="checkbox"
              role="switch"
              aria-label="Стрелки на связях"
              checked={showArrows}
              onChange={(event) => onShowArrowsChange(event.target.checked)}
            />
            <span className="track" aria-hidden="true">
              <span className="thumb"></span>
            </span>
            Стрелки на связях: {showArrows ? "вкл" : "выкл"}
          </label>
        </section>
      )}

      <section className="editorSection" aria-label="Управление узлами">
        <h3 className="editorSection__title">Узлы</h3>
        {graph.nodes.length > 0 ? (
          <label className="editorField">
            <span className="editorField__label">Выбранный узел</span>
            <select
              className="editorField__control"
              value={selectedNode ? selectedId : ""}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {graph.nodes.map((node) => (
                <option key={String(node.id)} value={String(node.id)}>
                  {node.name || node.id}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="nodeOperations__empty">В графе пока нет узлов.</p>
        )}

        <form className="nodeOperations__form" onSubmit={handleAddNode}>
          <label className="editorField">
            <span className="editorField__label">Имя нового узла</span>
            <input
              className="editorField__control"
              value={nodeName}
              onChange={(event) => setNodeName(event.target.value)}
              placeholder="Например, Новый узел"
              required
            />
          </label>
          {selectedNode && typeof selectedNode.id === "string" && (
            <label className="nodeOperations__connect">
              <input
                type="checkbox"
                checked={connectToSelected}
                onChange={(event) => setConnectToSelected(event.target.checked)}
              />
              Связать с выбранным узлом
            </label>
          )}
          <button className="nodeOperations__button" type="submit">Добавить узел</button>
        </form>

        <button
          className="nodeOperations__button nodeOperations__button--danger"
          type="button"
          onClick={handleDeleteNode}
          disabled={!selectedNode}
        >
          Удалить выбранный узел
        </button>

        {info && (
          <div className="nodeOperations__info" aria-live="polite">
            <strong>{info.name || info.id}</strong>
            <span>Уникальных соседей: {info.count}</span>
            {info.connectedNodes.length > 0 && (
              <span>{info.connectedNodes.map(node => node.name || node.id).join(", ")}</span>
            )}
          </div>
        )}
        {error && <p className="nodeOperations__error" role="alert">{error}</p>}
      </section>
    </div>
  );
}
