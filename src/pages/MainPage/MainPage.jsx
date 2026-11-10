import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";


export default function MainPage() {
  const KEY = "app:json-data";
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(file) {
    if (!file) return;
    setSelectedFile(file);
    setFileName(file.name);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const file = selectedFile;
    if (!file) {
      setError("Сначала выберите или перетащите JSON-файл.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("Размер файла не должен превышать 100 МБ.");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      setError("Не удалось прочитать файл. Проверьте, что это корректный JSON.");
      return;
    }

    if (!Array.isArray(parsed?.nodes) || !Array.isArray(parsed?.links)) {
      setError("В JSON должны быть массивы nodes и links.");
      return;
    }

    try {
      sessionStorage.setItem(KEY, JSON.stringify(parsed));
    } catch {
      setError("Не удалось сохранить файл в хранилище браузера.");
      return;
    }

    setFileName(file.name);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
    navigate("/Graph");
  }

  return (
    <section className="homePage">
      <form className="homeCard" onSubmit={handleSubmit}>
        <span className="homeEyebrow">ШАГ 01 · ИМПОРТ ДАННЫХ</span>
        <h1>Рабочая область</h1>
        <p className="homeDescription">
          Загрузите файл с описанием узлов и связей, чтобы построить сетевой граф.
        </p>

        <div
          className={`homeDropzone${isDragging ? " isDragging" : ""}${fileName ? " hasFile" : ""}`}
          role="group"
          tabIndex={0}
          aria-label="Область выбора JSON-файла"
          onClick={(event) => {
            if (event.target.closest("button, input")) return;
            fileInputRef.current?.click();
          }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsDragging(false);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            selectFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            id="json-file"
            ref={fileInputRef}
            className="homeFileInput"
            type="file"
            name="file"
            accept="application/json,.json"
            aria-label="Выбрать JSON-файл"
            onChange={(event) => {
              selectFile(event.target.files[0]);
            }}
          />
          <span className="homeUploadIcon" aria-hidden="true">↑</span>
          <strong>{fileName || "Перетащите JSON-файл сюда"}</strong>
          <span className="homeDropHint">или выберите файл с устройства</span>
          <button
            className="homeSelectFile"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Выбрать файл
          </button>
        </div>

        <div className={`homeFileInfo${error ? " hasError" : ""}`} role="status">
          {error || (fileName ? `Выбран файл: ${fileName}` : "JSON · максимум 100 МБ")}
        </div>

        <button className="homeActionMock" type="submit">
          Обработать файл локально <span aria-hidden="true">→</span>
        </button>


      </form>
    </section>
  );
}
