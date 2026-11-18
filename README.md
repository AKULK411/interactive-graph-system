# Network Graph

*Интерактивная визуализация сетей и показателей их узлов.*

> <span style="display:inline-flex;align-items:center;justify-content:center;width:1.7em;height:1.7em;margin-right:.5em;border-radius:.45em;background:#263449;color:#fff;font-weight:700;vertical-align:middle;">↗</span> **[Открыть основной сайт](https://network-graph-wmhw.onrender.com/)**  
> Загрузите JSON-файл на открывшейся странице, чтобы построить граф.

---

## <span style="display:inline-flex;align-items:center;justify-content:center;width:1.55em;height:1.55em;margin-right:.45em;border-radius:.4em;background:#263449;color:#fff;font-size:.82em;vertical-align:middle;">◎</span> О проекте

**Network Graph** превращает данные о сетевых объектах и связях между ними в интерактивный граф. Каждый объект отображается узлом, а связь — линией между узлами. Это помогает быстрее понять структуру сети, исследовать зависимости и оценить состояние отдельных элементов.

Приложение можно использовать для изучения связей между серверами, сервисами и другими объектами. Если в исходном JSON есть показатели нагрузки, Network Graph также помогает заметить узлы, которым требуется внимание.

## <span style="display:inline-flex;align-items:center;justify-content:center;width:1.55em;height:1.55em;margin-right:.45em;border-radius:.4em;background:#263449;color:#fff;font-size:.82em;vertical-align:middle;">⌘</span> Основные возможности

- **Импорт данных:** выберите JSON-файл на устройстве или перетащите его в окно приложения. Нужны массивы `nodes` и `links`; максимальный размер файла — 10 МБ. Данные обрабатываются в браузере и временно хранятся в текущей вкладке.
- **Два режима визуализации:** переключайтесь между графом в 2D и 3D. В режиме 2D можно включать стрелки и настраивать движущиеся маркеры на связях.
- **Цветовая индикация:** цвет узла показывает уровень нагрузки; значение цветов поясняется легендой.
- **Поиск и метрики:** ищите узлы по ID, имени или роли. Для выбранного узла доступны статус, количество доступных CPU, загрузка процессора, использование памяти, полученный и отправленный сетевой трафик, число пакетов и время измерения.
- **Редактирование:** добавляйте узлы, при необходимости соединяйте их с выбранным узлом, удаляйте узлы вместе с их связями и просматривайте соседние узлы.

## <span style="display:inline-flex;align-items:center;justify-content:center;width:1.55em;height:1.55em;margin-right:.45em;border-radius:.4em;background:#263449;color:#fff;font-size:.82em;vertical-align:middle;">→</span> Как пользоваться

1. Откройте основной сайт по ссылке вверху документа.
2. Загрузите JSON с массивами `nodes` и `links`.
3. Переключайте 2D/3D, выбирайте узлы на графе или найдите нужный через поиск.
4. Просмотрите метрики выбранного узла в панели приложения.

> **Примечание:** если открыть страницу графа без предварительно загруженного JSON, приложение предложит сначала загрузить файл.

## <span style="display:inline-flex;align-items:center;justify-content:center;width:1.55em;height:1.55em;margin-right:.45em;border-radius:.4em;background:#263449;color:#fff;font-size:.76em;vertical-align:middle;">{ }</span> Формат данных

Минимальный JSON должен содержать массив узлов `nodes` и массив связей `links`. Например:

```json
{
  "nodes": [
    { "id": "service-a", "name": "Сервис A" },
    { "id": "service-b", "name": "Сервис B" }
  ],
  "links": [
    { "source": "service-a", "target": "service-b" }
  ]
}
```

## <span style="display:inline-flex;align-items:center;justify-content:center;width:1.55em;height:1.55em;margin-right:.45em;border-radius:.4em;background:#263449;color:#fff;font-size:.74em;font-family:monospace;vertical-align:middle;">&gt;_</span> Запуск локально

Проект создан на **React** и **Vite**. Понадобится установленный **Node.js** (вместе с npm).

1. Скачайте или клонируйте исходный проект. Откройте терминал в корневой папке проекта — там, где находится `package.json`.
2. Установите зависимости:

   ```bash
   npm install
   ```

3. Запустите локальный сервер:

   ```bash
   npm run dev
   ```

4. Откройте адрес, который Vite покажет в терминале. Обычно это `http://localhost:5173/`.
5. Чтобы остановить сервер, нажмите `Ctrl+C` в терминале.

Для проверки production-сборки можно выполнить `npm run build`.
