import { useState } from "react";
import "./MainPage.css";

// Ограничение загрузки — 10 МБ. Меняйте число здесь,
// если лимит файла в интерфейсе должен быть другим.
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function MainPage() {
  // file — выбранный файл; error — сообщение о проблеме;
  // dragging — состояние зоны, когда файл перетаскивают над ней.
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  // Проверяет размер файла и сохраняет его для отображения в интерфейсе.
  function selectFile(nextFile) {
    if (!nextFile) return;

    if (nextFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Файл должен быть меньше 10 МБ");
      return;
    }

    setFile(nextFile);
    setError("");
  }

  return (
    <div className="mainPage">
      {/* Верхняя панель: название проекта и путь к текущей странице. */}
      <header className="mainHeader">
        <a className="logo" href="#" aria-label="Network-Graph">
          Network<span>-Graph</span><i />
        </a>

        <div className="breadcrumb">
          Network-Graph <b>/</b> <strong>Импорт данных</strong>
        </div>
      </header>

      {/* Основная область растягивается между header и footer,
          чтобы карточка загрузки оставалась по центру экрана. */}
      <main className="mainContent">
        <section className="uploadCard" aria-labelledby="upload-title">
          <span className="eyebrow">Network-Graph · NETWORK VISUALIZER</span>
          <h1 id="upload-title">Загрузите файл</h1>
          <p className="intro">
            Добавьте данные сетевого графа, чтобы начать работу.
          </p>

          {/* Label работает как зона перетаскивания и как кнопка выбора файла.
              CSS растягивает прозрачный input на всю область. */}
          <label
            className={`dropzone${dragging ? " isDragging" : ""}${file ? " hasFile" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              selectFile(event.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept=".json,.csv,.txt,.tsv,.graphml,.gexf"
              onChange={(event) => selectFile(event.target.files[0])}
            />

            <span className="uploadIcon" aria-hidden="true">↑</span>
            <strong>{file ? file.name : "Перетащите файл сюда"}</strong>
            <span className="dropHint">или выберите файл на устройстве</span>
            <span className="selectButton">Выбрать файл <b>→</b></span>
          </label>

          {/* Здесь показывается ошибка, размер выбранного файла
              или подсказка о форматах и лимите. */}
          <div
            className={`fileInfo${error ? " fileError" : ""}`}
            aria-live="polite"
          >
            {error ||
              (file
                ? `${(file.size / 1024).toFixed(1)} КБ · файл выбран`
                : "JSON, CSV, GraphML · до 10 МБ")}
          </div>
        </section>
      </main>

      {/* Нижняя панель: подпись продукта и пояснение про локальную обработку. */}
      <footer className="mainFooter">
        <span>Network-Graph · Network observability</span>
        <span><i aria-hidden="true" /> Файлы обрабатываются локально</span>
      </footer>
    </div>
  );
}
