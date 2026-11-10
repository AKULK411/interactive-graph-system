import { Link } from "react-router-dom";
import "./NotFound.css";

// Страница для URL, для которого нет маршрута.
export default function NotFound() {
  return (
    <section className="notFoundPage">
      <span className="notFoundCode">404</span>
      <h1>Такой страницы нет</h1>
      <p>Похоже, ссылка устарела или адрес был введён с ошибкой.</p>
      <Link to="/" className="notFoundLink">
        На главную <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
