import { Link } from "react-router-dom";
import "./NotFound.css";

// Ошибка маршрута в визуальном языке Network-Graph.
export default function NotFound() {
  return (
    <section className="notFoundPage">
      <div className="notFoundCard">
        <div className="notFoundTopline">
          <span className="notFoundEyebrow">NETWORK-GRAPH / SYSTEM</span>
          <span className="notFoundStatus"><i /> ROUTE NOT FOUND</span>
        </div>

        <div className="notFoundVisual" aria-hidden="true">
          <div className="notFoundGrid" />
          <svg className="notFoundNetwork" viewBox="0 0 560 210" fill="none">
            <path d="M74 104 L178 48 L280 105 L386 48 L486 105 M178 48 L176 164 L280 105 L386 164 L486 105" />
            <path d="M74 104 L176 164 M386 48 L386 164" className="notFoundBroken" />
            <circle cx="74" cy="104" r="8" />
            <circle cx="178" cy="48" r="8" />
            <circle cx="176" cy="164" r="8" />
            <circle cx="280" cy="105" r="13" className="notFoundCenter" />
            <circle cx="386" cy="48" r="8" />
            <circle cx="386" cy="164" r="8" />
            <circle cx="486" cy="105" r="8" />
            <path d="M265 90 L295 120 M295 90 L265 120" className="notFoundCross" />
          </svg>
          <span className="notFoundBigCode">404</span>
          <span className="notFoundVisualLabel">NODE / 0x194</span>
        </div>

        <div className="notFoundContent">
          <span className="notFoundIndex">ОШИБКА  ·  04 / 04</span>
          <h1>Потеряли связь?</h1>
          <p>
            Такой страницы нет в сети. Возможно, адрес изменился
            или ссылка ведёт к несуществующему узлу.
          </p>
          <Link to="/" className="notFoundLink">
            Вернуться на главную <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="notFoundBottom">
          <span>NETWORK STATUS: <b>DISCONNECTED</b></span>
          <span>HTTP RESPONSE <b>404</b></span>
        </div>
      </div>
    </section>
  );
}
