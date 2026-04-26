# Todo List Fullstack (Go + React + PostgreSQL)

Полноценный todo-list: backend на Go, frontend на React + strict TypeScript (FSD), база PostgreSQL.

## Возможности

- добавить todo
- удалить todo
- получить список todo
- завершить todo
- пользоваться приложением через веб-интерфейс

## Структура проекта

```text
.
├── cmd/api                 # Точка входа backend
├── internal/config         # Конфигурация из env
├── internal/http           # HTTP handlers и роутинг
├── internal/todo           # Модель + postgres repository
├── web                     # React frontend (Feature-Sliced Design)
├── migrations              # SQL схема
├── Dockerfile              # Сборка API-контейнера
└── docker-compose.yml      # PostgreSQL + API + frontend
```

## Быстрый старт

### Запуск всего проекта через Docker

```bash
docker compose up -d --build
```

После запуска:

- frontend: `http://localhost:5173`
- backend API: `http://localhost:8080`
- postgres: `localhost:5433`

## Понятный алгоритм запуска всей сборки

1. Убедиться, что установлены `Docker` и `Docker Compose`.
2. Открыть корень проекта (где лежит `docker-compose.yml`).
3. Выполнить:

```bash
docker compose up -d --build
```

4. Проверить, что контейнеры живы:

```bash
docker compose ps
```

5. Открыть фронтенд в браузере: `http://localhost:5173`.
6. Если нужно остановить проект:

```bash
docker compose down
```

7. Если нужно остановить и удалить volume с БД (полный сброс данных):

```bash
docker compose down -v
```

## Локальный запуск в dev-режиме

### 1) Backend

Установите Go 1.24+:

```bash
go mod tidy
go run ./cmd/api
```

### 2) Frontend

Установите Node.js 22+:

```bash
cd web
npm install
npm run typecheck
npm run dev
```

## Переменные окружения backend

- `HTTP_ADDRESS` (по умолчанию `:8080`)
- `DATABASE_URL` (по умолчанию `postgres://postgres:postgres@localhost:5433/todo_db?sslmode=disable`)

## Переменные окружения frontend

- `VITE_API_URL` (по умолчанию `http://localhost:8080`)

## API

### Добавить todo

`POST /todos`

```json
{
  "title": "Купить молоко"
}
```

### Список todo

`GET /todos`

### Завершить todo

`PATCH /todos/{id}/complete`

### Удалить todo

`DELETE /todos/{id}`

## Примеры curl

```bash
curl -X POST http://localhost:8080/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Купить молоко"}'

curl http://localhost:8080/todos

curl -X PATCH http://localhost:8080/todos/1/complete

curl -X DELETE http://localhost:8080/todos/1
```
