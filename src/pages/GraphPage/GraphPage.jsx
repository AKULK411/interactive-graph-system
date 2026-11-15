import { useState, useMemo,  useCallback } from "react";
import { NavLink } from "react-router-dom";
import Graph2D from "../../components/Graph2D/Graph2D";
import Graph3D from "../../components/Graph3D/Graph3D";
import NodeOperations from "../../components/nodeOperations";
import NodeMetricCard from "../../components/NodeMetricCard/NodeMetricCard";
import "./GraphPage.css";

const KEY = "app:json-data";

function readGraph() {
  const storedGraph = sessionStorage.getItem(KEY);
  if (!storedGraph) return { graph: null, error: "" };

  try {
    const graph = JSON.parse(storedGraph);
    if (!Array.isArray(graph?.nodes) || !Array.isArray(graph?.links)) {
      throw new Error("В данных графа должны быть массивы nodes и links.");
    }
    return { graph, error: "" };
  } catch (error) {
    return { graph: null, error: `Не удалось загрузить граф: ${error.message}` };
  }
}

export default function GraphPage() {
  const [initialState] = useState(readGraph);
  const [graph, setGraph] = useState(initialState.graph);
  const [loadError, setLoadError] = useState(initialState.error);
  const [graphView, setGraphView] = useState("2D");
  const [particleCount, setParticleCount] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [metricsQuery, setMetricsQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  function handleGraphChange(updatedGraph) {
    sessionStorage.setItem(KEY, JSON.stringify(updatedGraph));
    setGraph(updatedGraph);
    setLoadError("");
  }

  const filteredNodes = useMemo(() => {
    const query = metricsQuery.trim().toLocaleLowerCase();
    const nodes = graph?.nodes || [];
    if (!query) return [];
    return nodes.filter((node) =>
      [node.id, node.name, node.role, node.type].some((value) =>
        String(value || "").toLocaleLowerCase().includes(query)
      )
    );
  }, [graph, metricsQuery]);

  const selectedNode = graph?.nodes.find((node) => String(node.id) === String(selectedNodeId)) || null;
  const hasSearchQuery = metricsQuery.trim().length > 0;

  const selectNode = useCallback((nodeId) => {
    setSelectedNodeId(nodeId);
    setMetricsQuery("");
  }, []);


  return (
    <section className="graphPage">
      <div className="graphWorkspace">
        
        <aside className="metricsPanel">
          <header className="sidePanelHeader">
            <h1>Метрики</h1>
            <span>{selectedNode ? "Выбранный узел" : "Выберите узел"}</span>
          </header>

          {graph ? (
            <>
              <div className="metricsSearchWrap">
                <label className="metricsSearch">
                  <span className="metricsSearch__label">Поиск по ID, имени или роли</span>
                  <input
                    type="text"
                    value={metricsQuery}
                    onChange={(event) => setMetricsQuery(event.target.value)}
                    placeholder="Найти узел…"
                    aria-expanded={hasSearchQuery}
                    aria-controls="metrics-node-search-results"
                  />
                </label>

                {hasSearchQuery && (
                  <div className="metricsSearchResults" id="metrics-node-search-results" aria-label="Результаты поиска узлов">
                    {filteredNodes.length > 0 ? (
                      filteredNodes.map((node) => (
                        <button
                          className="metricsSearchResult"
                          key={String(node.id)}
                          type="button"
                          onClick={() => selectNode(node.id)}
                        >
                          <strong>{node.name || "Без имени"}</strong>
                          <span>ID: {node.id ?? "—"} · {node.role || node.type || node.metadata?.role || "без роли"}</span>
                        </button>
                      ))
                    ) : (
                      <p className="metricsPanel__empty">Нет таких узлов.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="metricsPanel__content">
                {selectedNode ? (
                  <NodeMetricCard node={selectedNode} />
                ) : (
                  <p className="metricsPanel__empty metricsPanel__empty--hint">
                    {hasSearchQuery
                      ? "Выберите узел из списка выше"
                      : "Метрики появятся здесь после нажатия на узел графа."}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="metricsPanel__content metricsPanel__content--empty">
              {loadError || "Метрики узлов появятся после загрузки JSON."}
            </div>
          )}
        </aside>

        <section className="graphPanel">
          {graph ? (
            <div className="graphCanvasArea">
              {graphView === "2D" ? (
                <Graph2D graph={graph} value={particleCount} showArrows={showArrows} onNodeSelect={selectNode}/>
              ) : (
                <Graph3D graph={graph} onNodeSelect={selectNode}/>
              )}
            </div>
          ) : (
            <div className="graphEmptyState">
              <span className="graphEmptyState__icon" aria-hidden="true">⌘</span>
              <h2>{loadError ? "Не удалось открыть граф" : "Граф пока не загружен"}</h2>
              <p>{loadError || "Сначала добавьте JSON с узлами и связями"}</p>
              <NavLink to="/" className="graphEmptyState__link">
                Перейти к загрузке <span aria-hidden="true">→</span>
              </NavLink>
            </div>
          )}
        </section>

        <aside className="editorPanel">
          <header className="sidePanelHeader">
            <div className="sidePanelHeader__text">
              <h2>Редактирование</h2>
              <span>Параметры выбранных узлов</span>
            </div>
            <div className="graphTypeButtons" role="group" aria-label="Режим графа">
              <button className={graphView === "2D" ? "isActive" : ""} onClick={() => setGraphView("2D")}>2D</button>
              <button className={graphView === "3D" ? "isActive" : ""} onClick={() => setGraphView("3D")}>3D</button>
            </div>
          </header>
          {graph && (
            <NodeOperations
              graph={graph}
              onGraphChange={handleGraphChange}
              view={graphView}
              particleCount={particleCount}
              onParticleCountChange={setParticleCount}
              showArrows={showArrows}
              onShowArrowsChange={setShowArrows}
            />
          )}
          <div className="editorPanel__content"/>
        </aside>
      </div>
    </section>
  );
}
