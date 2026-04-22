# TableCRM Mobile Order

Мобильное webapp-приложение на `Next.js + TypeScript + Tailwind` для оформления заказа в TableCRM.

Проект повторяет основной смысл модального окна создания продажи, но в формате одного mobile-first экрана: подключение по токену, поиск клиента, выбор параметров заказа, подбор товаров, корзина и отправка продажи.

## Что сделано

- один основной экран без лишней многостраничности
- ввод токена и подключение к TableCRM API
- загрузка справочников:
  - `organizations`
  - `warehouses`
  - `payboxes`
  - `price_types`
- поиск клиента по телефону через `contragents`
- поиск товаров по названию через `nomenclature`
- корзина с редактированием:
  - цены
  - количества
  - скидки
- расчет итоговой суммы на клиенте
- сборка payload через отдельную функцию `buildSalePayload`
- создание продажи через `POST /docs_sales/`
- сценарий `создать и провести` через:
  - создание продажи
  - затем `PATCH /docs_sales/{id}/status`
- toast-уведомления, loading/error/empty states
- UI в стиле shadcn/ui primitives

## Стек

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Radix Select
- Sonner для toast

## Структура проекта

```text
app/
  layout.tsx
  page.tsx

components/
  page-header.tsx
  section-card.tsx
  section-header.tsx
  field-group.tsx
  field-row.tsx
  mobile-order-form.tsx
  token-section.tsx
  client-section.tsx
  order-meta-section.tsx
  product-search-section.tsx
  cart-section.tsx
  comment-section.tsx
  fixed-action-bar.tsx
  ui/

lib/
  api.ts
  payload.ts
  utils.ts

types/
  tablecrm.ts
```

## Как запустить локально

Важно: рабочий проект находится в папке `my-next-project`.

```bash
cd /Users/windmill312/Desktop/js-projects/mobile_order/my-next-project
npm install
cp .env.example .env.local
npm run dev
```

После запуска открыть:

- `http://localhost:3000`

## Production-проверка

```bash
npm run build
npm run start
```

## Тесты

В проект добавлены unit/integration тесты и smoke e2e.

### Запуск

```bash
npm run test:unit
npm run test:e2e
```

### Что покрыто

- `lib/utils.ts`
  - форматирование цены
  - нормализация телефона
  - парсинг чисел
  - извлечение массивов из API wrappers
- `lib/payload.ts`
  - расчет total
  - сборка sale payload
  - trimming comment
  - условное добавление `loyality_card_id`
  - conditionally omitted fields
- `lib/api.ts`
  - извлечение `id` созданной продажи из разных форм ответа
- `MobileOrderForm`
  - верхняя ошибка при пустом токене
  - `create sale` flow с mock API
  - `create and process` flow с проверкой второго шага `PATCH /status`
- smoke e2e страницы
  - рендер page shell
  - наличие ключевых секций
  - заблокированная форма до подключения
  - видимость fixed action area и initial total

### Почему это полезно для тестового

- unit-тесты проверяют ключевую бизнес-логику, а не только рендер
- integration-тесты проверяют форму как пользовательский flow без реального токена
- smoke e2e подтверждает, что страница поднимается и базовая UX-структура не сломана

## Переменные окружения

Файл `.env.example`:

```bash
NEXT_PUBLIC_TABLECRM_API_BASE=https://app.tablecrm.com/api/v1
NEXT_PUBLIC_TABLECRM_TOKEN=
```

`NEXT_PUBLIC_TABLECRM_TOKEN` не обязателен. Он нужен только как дефолтное значение для локального тестирования.

## Как пользоваться приложением

1. Вставить токен TableCRM.
2. Нажать `Подключить`.
3. После загрузки справочников выбрать:
   - организацию
   - склад
   - кассу
   - при необходимости тип цены
4. Ввести телефон клиента и выполнить поиск.
5. Выбрать клиента из найденного списка.
6. Найти товары по названию и добавить их в корзину.
7. При необходимости изменить цену, количество и скидку.
8. Нажать:
   - `Создать`
   - или `Провести`

## Бизнес-логика формы

Для MVP в payload используются следующие значения:

- `operation: "Заказ"`
- `tax_included: true`
- `tax_active: true`
- `priority: 0`
- `paid_lt: 0`
- `status: false`
- `settings: {}`
- `dated` = текущий unix timestamp в секундах

Если у выбранного клиента есть карта лояльности, в payload добавляется:

```json
"loyality_card_id": 123
```

Если карты нет, поле не отправляется.

## Submit-логика

### Создать продажу

Используется:

- `POST /api/v1/docs_sales/?token=...&generate_out=false`

Body отправляется как массив из одного документа.

### Создать и провести

Используется двухшаговый сценарий:

1. `POST /api/v1/docs_sales/?token=...&generate_out=false`
2. `PATCH /api/v1/docs_sales/{id}/status?token=...`

Body второго запроса:

```json
{
  "status": "processed"
}
```

## Использованные endpoint-ы

- `GET /api/v1/organizations/?token=...`
- `GET /api/v1/warehouses/?token=...`
- `GET /api/v1/payboxes/?token=...`
- `GET /api/v1/price_types/?token=...`
- `GET /api/v1/contragents/?token=...&phone=...`
- `GET /api/v1/nomenclature/?token=...&name=...&with_prices=true`
- `POST /api/v1/docs_sales/?token=...&generate_out=false`
- `PATCH /api/v1/docs_sales/{id}/status?token=...`

## Валидация перед submit

Кнопки отправки недоступны, если:

- не введен токен
- не выбран клиент
- не выбрана организация
- не выбран склад
- не выбрана касса
- корзина пуста

## Assumptions / Risks

Ниже только те ограничения, которые реально важны для проверки задания.

- Основной сценарий `создать продажу` надежнее, чем `создать и провести`, потому что для второго шага нужно корректно получить `id` созданной продажи из ответа API.
- Swagger подтверждает endpoint `PATCH /docs_sales/{id}/status`, но форма ответа `POST /docs_sales/` описана слабо, поэтому извлечение `id` сделано через безопасный runtime fallback.
- Для полноценной ручной проверки нужен валидный токен TableCRM. Если API отвергает токен, это блокирует end-to-end проверку независимо от фронтенда.
- Приложение работает напрямую с внешним API TableCRM без собственного backend proxy. Это упрощает MVP, но означает зависимость от CORS, доступности API и корректности токена.

## Что уже проверено

- проект собирается через `npm run build`
- проект проходит `npm run lint`
- проект проходит `npm run test:unit`
- проект проходит `npm run test:e2e`
- структура payload и основные endpoint-ы сверены со swagger
- UI, секции формы и клиентская валидация работают локально

## Что нужно подтвердить живым токеном

- успешную загрузку справочников
- успешный поиск клиента
- успешный поиск товаров с реальными ценами
- успешный `POST /docs_sales/`
- успешный сценарий `create and process` с реальным `id` из ответа backend

## Deploy

Проект готов к деплою на Vercel.

Для Vercel нужно:

1. указать root directory проекта как `my-next-project`, если деплой идет из общего каталога `mobile_order`
2. добавить переменные окружения при необходимости
3. выполнить обычный deploy Next.js проекта

## Комментарий для проверки

Если нужен самый важный сценарий для ревью, сначала проверяйте `Создать продажу`.

Именно он является основным MVP-flow и на него в проекте сделан главный приоритет.
# table-crm-mobile-order
