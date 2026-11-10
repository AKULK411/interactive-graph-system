import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import "../../App.css";

// Общий каркас маршрутов. На странице графа футер скрыт,
// чтобы рабочая область занимала всю высоту, как в макете.
export default function Layout() {
  const { pathname } = useLocation();
  const isGraphPage = pathname.toLowerCase() === "/graph";

  return (
    <div className={`appLayout${isGraphPage ? " appLayout--graph" : ""}`}>
      <Header />
      <main className="appMain">
        <Outlet />
      </main>
      {!isGraphPage && <Footer />}
    </div>
  );
}
