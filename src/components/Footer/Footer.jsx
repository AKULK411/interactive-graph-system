import "./Footer.css";

// Общий footer; кратко сообщает о локальной обработке данных.
export default function Footer() {
  return (
    <footer className="siteFooter">
      <span>Network-Graph · Network observability</span>
      <span className="footerPrivacy"><i aria-hidden="true" /> Файлы обрабатываются в браузере</span>
    </footer>
  );
}
