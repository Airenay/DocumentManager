Состав исходных кодов проекта
-----------------------------

Директории проекта:
 - contracts              (SOL) Smart-контракты Ethereum
 - graph                  (GQL) GraphQL интерфейс между блокчейном и web-приложением
 - scripts                (SH) Вспомогательные скрипты (основные запускаются через npm run)
 - components             (UI) React компоненты UI
 - conf                   (UI) Файлы конфигурации webapp
 - hooks                  (UI) React hooks
 - pages                  (UI) Страницы webapp
 - public                 (UI) Статические файлы webapp
 - styles                 (UI) Файлы стилей (CSS/SCSS)
 - utils                  (UI) Вспомогательные скрипты js
 - docs                   (DOC) Различная документация
 - build                  (TMP) Результаты компиляции smart-контрактов и Graph
 - generated              (TMP) Результаты генерации кода Graph
 - node_modules           (TMP) Установленные модули системы разработки


Порядок запуска в тестовой сети
-------------------------------

Установка исходников и пакетов:
 - git clone ...
 - npm i

Запуск сервисов в разных окнах (остаются работать)
 - npm run chain             (локальная версия блокчейна Ganache)
 - npm run graph             (Docker версия Graph стека с базой данных)
 - npm run dev               (next.js development сервер)

Компиляция и разворачивание контракта в блокчейне
 - npm run oz:compile
 - npm run oz:deploy         (выбрать upgradeable, можно не инициализировать или initialize с любым числом)

Компиляция кода Graph
 - npm run graph:codegen
 - npm run graph:build
 - npm run graph:create-local
 - npm run graph:deploy-local    (при обновлении mapping.ts достаточно повторить только это для апгрейда Graph)

На localhost:3000 работает веб-приложение, на localhost:8000 работает Graph. В нем можно выбрать:
