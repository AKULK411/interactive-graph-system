import { useState } from "react";
import { NavLink } from "react-router-dom";
import Graph2D from "../../components/Graph2D/Graph2D";
import Graph3D from "../../components/Graph3D/Graph3D";
import NodeOperations from "../../components/nodeOperations";
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

  function handleGraphChange(updatedGraph) {
    sessionStorage.setItem(KEY, JSON.stringify(updatedGraph));
    setGraph(updatedGraph);
    setLoadError("");
  }

  return (
    <section className="graphPage">
      <div className="graphWorkspace">
        <aside className="metricsPanel">
          <header className="sidePanelHeader">
            <h1>Метрики</h1>
            <span>Сводка по узлам</span>
          </header>
          <div className="metricsPanel__content" aria-label="Место для метрик" />
        </aside>

        <section className="graphPanel" aria-label="Сетевой граф">
          {graph ? (
            <div className="graphCanvasArea">
              {graphView === "2D" ? (
                <Graph2D
                  graph={graph}
                  value={particleCount}
                  showArrows={showArrows}
                />
              ) : (
                <Graph3D graph={graph} />
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
              <button
                className={graphView === "2D" ? "isActive" : ""}
                aria-pressed={graphView === "2D"}
                onClick={() => setGraphView("2D")}
              >
                2D
              </button>
              <button
                className={graphView === "3D" ? "isActive" : ""}
                aria-pressed={graphView === "3D"}
                onClick={() => setGraphView("3D")}
              >
                3D
              </button>
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
          <div className="editorPanel__content" aria-label="Место для редактирования" />
        </aside>
      </div>
    </section>
  );
}
