import { Link } from "react-router-dom";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <main className="aboutPage pageWrap">
      <header className="aboutHero">
        <span className="aboutEyebrow">NETWORK-GRAPH · СПРАВКА</span>
        <h1>Ваша инфраструктура — как на ладони</h1>
        <p>
          Network-Graph помогает увидеть связи между элементами сети,
          разобраться в структуре инфраструктуры и понять, какие узлы
          взаимодействуют друг с другом.
        </p>
        <Link to="/" className="aboutCta">
          Перейти к загрузке →
        </Link>
      </header>

      <section className="aboutSection">
        <span className="aboutEyebrow">ЗАЧЕМ НУЖЕН СЕРВИС</span>
        <h2>Разберитесь в структуре сети</h2>
        <p className="aboutDescription">
          Сервис пригодится для изучения IT-инфраструктуры: он помогает
          наглядно представить связи между серверами и сервисами, увидеть
          зависимости и быстрее разобраться в устройстве сети.
        </p>

        <div className="aboutCards">
          <article className="aboutCard">
            <span>01</span>
            <h3>Подготовьте JSON</h3>
            <p>Опишите узлы сети и соединения между ними.</p>
          </article>
          <article className="aboutCard">
            <span>02</span>
            <h3>Загрузите файл</h3>
            <p>Выберите JSON-файл с корректной структурой.</p>
          </article>
          <article className="aboutCard">
            <span>03</span>
            <h3>Изучите сеть</h3>
            <p>Просматривайте связи и анализируйте состав инфраструктуры.</p>
          </article>
        </div>
      </section>

      <section className="aboutSection">
        <span className="aboutEyebrow">ОГРАНИЧЕНИЯ</span>
        <h2>Рекомендуемая нагрузка</h2>

        <div className="aboutCards aboutLimits">
          <article className="aboutCard">
            <strong>10 МБ</strong>
            <h3>Размер файла</h3>
            <p>Максимальный размер загружаемого файла.</p>
          </article>
          <article className="aboutCard">
            <strong>2 000–2 500</strong>
            <h3>Количество узлов</h3>
            <p>
              Рекомендуемый предел. При большем количестве граф может
              значительно замедлиться, а браузер — зависнуть.
            </p>
          </article>
          <article className="aboutCard">
            <strong>JSON</strong>
            <h3>Формат данных</h3>
            <p>Для загрузки используйте файлы с расширением .json.</p>
          </article>
        </div>

        <p className="aboutPrivacy">
          Файлы размером до 10 МБ по задумке проекта обрабатываются локально
          в браузере и не отправляются на сервер.
        </p>
      </section>

      <footer className="aboutFooter">
        <div>
          <span className="aboutEyebrow">ГОТОВЫ НАЧАТЬ?</span>
          <h2>Загрузите данные и изучите свою сеть</h2>
        </div>
        <Link to="/" className="aboutCta">
          Открыть рабочую область →
        </Link>
      </footer>
    </main>
  );
}
