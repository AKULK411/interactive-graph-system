import { NavLink } from "react-router-dom";
import "./Header.css";

// Общая оранжевая навигация для всех страниц приложения.
export default function Header() {
  return (
    <header className="siteHeader">
      <NavLink className="siteBrand" to="/" aria-label="Network-Graph — главная">
        <span className="siteBrandMark">N</span>
        <span>Network<span className="siteBrandAccent">-Graph</span></span>
      </NavLink>

      <nav className="siteNav" aria-label="Основная навигация">
        <NavLink to="/" end className={({ isActive }) => isActive ? "siteNavLink active" : "siteNavLink"}>
          Главная
        </NavLink>
        <NavLink to="/Graph" className={({ isActive }) => isActive ? "siteNavLink active" : "siteNavLink"}>
          Графы
        </NavLink>
        <NavLink to="/About" className={({ isActive }) => isActive ? "siteNavLink active" : "siteNavLink"}>
          About
        </NavLink>
      </nav>
    </header>
  );
}
