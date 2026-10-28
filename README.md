<div align="center">

<h1>
  📆 Marvig
</h1>

[![GitHub stars](https://img.shields.io/github/stars/Arviixzuhs/Marvig?style=for-the-badge)](https://github.com/Arviixzuhs/Marvig/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Arviixzuhs/Marvig?style=for-the-badge)](https://github.com/Arviixzuhs/Marvig/network)
[![GitHub issues](https://img.shields.io/github/issues/Arviixzuhs/Marvig?style=for-the-badge)](https://github.com/Arviixzuhs/Marvig/issues)

**Hotel management system and web booking engine** to run the operations of Posada Marvig through a customer-facing application, a management panel, and a conversational assistant.

</div>

---

## Overview

Marvig brings the booking and operational processes of a guesthouse together in a single solution. The backend provides management features for staff and booking operations for customers; the frontend consumes its services, and the chatbot lets users query information through natural language.

### Features

- Registration, lookup, and management of bookings and apartments.
- Availability lookup by date and tracking of apartment statuses.
- Management of seasons, promotions, and pricing associated with accommodation.
- Income tracking through payments, plus tracking of expenses, employees, and reports.
- User authentication, role management, and notifications.
- **Marvig AI** conversational assistant with chat and message history.
- Tool use (function calling) to query operational information such as availability, apartments, payments, promotions, and financial metrics.

---

## Architecture and Technologies

The repository is organized into three independent applications, each with its own `package.json` and dependency file.

### Management backend (`backend/`)

- **NestJS 11 and TypeScript**, organized into functional modules.
- **GraphQL** with Apollo Server for queries and mutations; the schema is generated from code.
- **PostgreSQL** with Prisma ORM. The schema models, among other entities, users, apartments, bookings, payments, expenses, promotions, and seasons.
- Layered module structure: domain, application, and infrastructure. It uses use cases, ports and repository adapters, mappers, and DTOs/inputs.
- Specification builders to translate query filters into persistence criteria.

### Frontend (`frontend/`)

- **React 19**, **TypeScript**, **Vite 6**, and React Router.
- **Redux Toolkit / React Redux** for global state.
- **Tailwind CSS 4** and **HeroUI** for the interface.
- **Apollo Client** for GraphQL and Axios for HTTP requests.
- `VITE_*` variables are embedded in the bundle at build time; they are not secrets and must not contain private credentials.

### Chatbot (`chatbot/`)

- Standalone service built with **NestJS 11**, TypeScript, and an HTTP API.
- **MongoDB 6** with Prisma to store chatbot users, conversations, and messages.
- OpenAI SDK configured with **OpenRouter** to generate streaming responses and request tool calls.
- Tools delegate functional queries to the management API. The client can cancel the generation of a response.

---

## Repository Structure

```text
Marvig/
├── backend/
│   ├── prisma/                 # PostgreSQL schema and migrations
│   ├── src/
│   │   ├── common/             # Shared guards, DTOs, utilities, and mappers
│   │   └── modules/            # Auth, bookings, apartments, payments, expenses, etc.
│   ├── test/
│   ├── Dockerfile
│   └── docker-compose.yml
├── chatbot/
│   ├── prisma/                 # Chat and message schema for MongoDB
│   ├── skills/                 # Context instructions for Marvig AI
│   ├── src/
│   │   ├── modules/            # Bot, chats, messages, and users
│   │   └── tools/              # Tools callable by the model
│   ├── Dockerfile
│   └── docker-compose.yml
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── modules/
    │   └── ...                 # Routes, state, services, and views
    ├── Dockerfile
    └── docker-compose.yml
```

---

## Prerequisites

For local development:

- **Node.js 22** and npm (the Dockerfiles use Node 22).
- **PostgreSQL 16** for the backend.
- **MongoDB 6** for the chatbot.
- Credentials for any external providers you plan to use (for example, OpenRouter, Google OAuth, email, or Stripe).

Docker Engine with Docker Compose is optional for local development and required to run the containers.

## Installation and Development

Clone the repository and set up each application separately:

```bash
git clone https://github.com/Arviixzuhs/marvig.git
cd marvig
```

### 1. Backend

```bash
cd backend
npm ci
```

Create `backend/.env` from `backend/.env.example` and configure, at a minimum, `DATABASE_URL`, `SECRET_KEY`, and `CLIENT_ORIGIN`. Make sure PostgreSQL is available and that the database specified in the URL exists.

```bash
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

The server uses port `3000` by default. GraphQL is served at `/graphql`; Swagger documentation is at `/api`. The GraphQL playground is enabled when `SERVER_MODE=DEVELOPMENT`.

### 2. Chatbot

In another terminal:

```bash
cd chatbot
npm ci
```

Create `chatbot/.env` from `chatbot/.env.example`. Configure the MongoDB connection, the management API URL, the frontend origin, and the OpenRouter variables described in the environment table. For development, start the service with:

```bash
npx prisma generate
npm run start:dev
```

The default configured port is `3001`.

### 3. Frontend

In another terminal:

```bash
cd frontend
npm ci
```

Create `frontend/.env` from `frontend/.env.example`, adjust the API URLs, and run:

```bash
npm run dev
```

Vite starts the development server (by default, `http://localhost:5173`). To verify a production build:

```bash
npm run build
npm run preview
```
