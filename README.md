# Web DevKit Plugin for Config Studio 🌐

[![Version](https://img.shields.io/badge/Version-v1.3.2-teal.svg)](https://github.com/config-studio/config-studio-web-devkit/releases)
[![Format](https://img.shields.io/badge/Format-.cspkg%20(MRS)-blue.svg)](https://github.com/config-studio/config-studio-plugins)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Официальный плагин **Web DevKit** для [Config Studio](https://github.com/config-studio/config-studio).
Превращает Config Studio в полноценную среду разработки веб-страниц, верстки и PHP-скриптов с интерактивным предпросмотром, симуляцией браузера Chrome и навигацией по AST-карте документа.

---

## 🚀 Ключевые возможности

### 1. Живой Split-Screen предпросмотр (Live Preview)
- Мгновенный рендеринг HTML, CSS, SVG и PHP прямо в боковой сплит-панели редактора.
- Автоматическое горячее обновление (Live Reload) при сохранении файла (`Ctrl+S`).
- **Интерактивная адресная строка Chrome:** симуляция реальной вкладки браузера с кнопками «Назад», «Вперед», «Обновить» и индикатором защищенного соединения.
- **Адаптивные пресеты вьюпорта:**
  - **Full** (адаптивная ширина 100%)
  - **Desktop** (1280px)
  - **Tablet** (768px)
  - **Mobile** (375px)

### 2. Встроенный веб-сервер :8085
- Запуск локального PHP-сервера (`php -S 0.0.0.0:8085`) в 1 клик прямо из тулбара редактора.
- Автоматический fallback на Python HTTP-сервер (`python -m http.server 8085`), если PHP не установлен на хосте.
- Кнопка быстрого перехода на работающий сервер в новой вкладке внешнего браузера.

### 3. Парсер AST-структуры документа (HTML/PHP Outline Provider)
- Интеграция с нативной AST-картой ядра Config Studio.
- Иерархическое дерево HTML-элементов (тегов, заголовков `h1..h6`, форм, скриптов) и PHP-функций с бейджами и номерами строк.
- Мгновенный переход (Quick Jump) к строке кода кликом по элементу дерева.

### 4. Интеллектуальное автодополнение Monaco (IntelliSense)
- Готовые сниппеты HTML5 (базовая разметка с подключением Tailwind CDN, контейнеры, формы, кнопки, скрипты).
- Автодополнение стандартных функций PHP, суперглобалов (`$_GET`, `$_POST`, `$_SESSION`), циклов и блоков `try-catch`.

---

## 📦 Установка

### В 1 клик из приложения (рекомендуется)
1. В Config Studio откройте **Настройки (⚙️) → Плагины → вкладка Каталог**.
2. Найдите **Web DevKit v1.3.2** и нажмите **«Установить»**.

### Установка пакета `.cspkg`
1. Скачайте `web-devkit.cspkg` со страницы [Релизов](https://github.com/config-studio/config-studio-web-devkit/releases).
2. Перетащите скачанный файл в окно настроек Config Studio (вкладка «Плагины»).

---

## 🛡️ Требуемые разрешения

- `ui.panels` — отображение кнопки в тулбаре и сплит-панели предпросмотра.
- `terminal.exec` — запуск локального веб-сервера (`php` / `python`).
- `network.bind` — открытие порта 8085 для локального предпросмотра.
- `toolbar` — кнопка быстрого запуска в Action Toolbar.
- `contextmenu` — пункты предпросмотра в контекстном меню проводника.

---

## 📄 Лицензия

MIT License © 2026 Edvard Baldanov
