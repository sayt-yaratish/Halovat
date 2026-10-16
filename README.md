# Halovat — сайт-каталог матрасов (RU/UZ)

## Структура
public/index.html          — разметка
public/css/style.css       — все стили
public/js/config.js        — настройки (PIXEL_ID, ORDER_URL)
public/js/data.js          — товары, размеры, ЦЕНЫ и ФОТО (img:"img/xxx.jpg")
public/js/i18n.js          — тексты RU/UZ
public/js/pixel.js         — Meta Pixel (браузер)
public/js/app.js           — каталог, корзина, заказ
public/img/                — фото товаров (+ placeholder.jpg для фида)
server/server.js           — API заказа (/api/order) и фид (/feed/meta.xml)
server/services/telegram.js, amocrm.js, meta.js (CAPI), feed.js — интеграции по отдельности
server/lib/products.js     — читает public/js/data.js, цены считаются на сервере

## Запуск
1. `npm install`
2. `cp .env.example .env` и заполнить (пустые интеграции просто пропускаются)
3. `npm start` → http://localhost:3000

## Подключение
- Цены/фото: public/js/data.js (base — цена минимального размера, коэффициенты в SIZES).
- Pixel: вписать ID в public/js/config.js (PIXEL_ID) и в .env (META_PIXEL_ID). Сервер шлёт Purchase в CAPI с тем же event_id — Meta сама дедуплицирует.
- Проверка: Events Manager → Test events, код в META_TEST_CODE.
- Фид: Commerce Manager → Data sources → Data feed → URL: https://домен/feed/meta.xml (узбекская версия: ?lang=uz).
- Нужен HTTPS и прокси (nginx/Caddy) перед Node; запуск через pm2 или systemd.
- Онлайн-оплата (Payme/Click/Uzum): отдельный модуль server/services/payments.js — добавить после выбора системы.
