import "./GraphPage.css";
import Graph3D from "../../components/Graph3D/Graph3D";
import Graph2D from "../../components/Graph2D/Graph2D";
import { useState } from "react";
import { NavLink } from "react-router-dom";




export default function GraphPage() {
const KEY = "app:json-data";
const [graphView, setGraphView] = useState("2D");

function checkGraphData() {
  
  if (!sessionStorage.getItem(KEY)) {
    return (
      <div className="graphEmptyState">
        <span className="graphEmptyState__icon" aria-hidden="true">⌘</span>
        <h2>Граф пока не загружен</h2>
        <p>Сначала добавьте JSON с узлами и связями</p>
        <NavLink to='/' className="graphEmptyState__link">
          Перейти к загрузке <span aria-hidden="true">→</span>
        </NavLink>
      </div>
    );
  } else if (sessionStorage.getItem(KEY)) {
    if (graphView === "2D") {
      return <Graph2D />;
    } else {
      return <Graph3D />;
    }
  }
}


  return (
    <section className="graphPage">
      <div className="graphWorkspace">
        {/* Левая панель сводки метрик. */}
        <aside className="metricsPanel">
          <header className="sidePanelHeader">
            <h1>Метрики</h1>
            <span>Сводка по узлам</span>
          </header>
          <div className="metricsPanel__content" aria-label="Место для метрик" />
        </aside>

        {/* Центральный блок — состояние графа. */}
        <section className="graphPanel" aria-label="Макет области графа">{checkGraphData()}</section>

        {/* Правая панель редактора графа. */}
        <aside className="editorPanel">
          <header className="sidePanelHeader">
            <div className="sidePanelHeader__text">
              <h2>Редактирование</h2>
            <span>Параметры выбранных узлов</span>
            </div>
            <div className="graphTypeButtons">
              <button className='twoDButton' onClick={() => setGraphView("2D")}>
                2D
              </button>
              <button className='threeDButton' onClick={() => setGraphView("3D")}>
                3D
              </button>
            </div>
            
          </header>
          <div className="editorPanel__content" aria-label="Место для редактирования" />
        </aside>
      </div>
    </section>
  );
}
