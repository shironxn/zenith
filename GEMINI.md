# Project Overview

**Zenith** is a full-stack CRUD application for managing notes with a high-performance backend and a modern, responsive frontend.

## Architecture & Technology Stack

### Backend
- **Project Name:** Zenith
- **Language:** Go 1.22.2
- **Framework:** [Fiber](https://gofiber.io/) (v2)
- **Architecture:** Hexagonal (Ports & Adapters)
  - `internal/core/domain`: Entities and models.
  - `internal/core/port`: Interfaces for services and repositories.
  - `internal/core/service`: Core business logic implementation.
  - `internal/adapter/repository`: Data persistence (GORM).
  - `internal/adapter/http`: HTTP handlers, routes, and middleware.
- **ORM:** [GORM](https://gorm.io/) with PostgreSQL.
- **Authentication:** JWT (JSON Web Tokens) with Refresh Token support.
- **Validation:** [go-playground/validator](https://github.com/go-playground/validator).
- **API Documentation:** Swagger/OpenAPI (via [swag](https://github.com/swaggo/swag)).
- **Logging:** [charmbracelet/log](https://github.com/charmbracelet/log).

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (v14, App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)
- **State Management/Fetching:** [SWR](https://swr.vercel.app/) and [Axios](https://axios-http.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation.

---

## Directory Structure

```text
Zenith/
├── backend/                # Go backend service (Zenith API)
│   ├── cmd/                # Entry point (main.go)
│   ├── internal/           # Private application code
│   │   ├── adapter/        # Implementation details (HTTP, DB)
│   │   ├── core/           # Domain and business logic
│   │   ├── config/         # Configuration and initialization
│   │   └── util/           # Shared utilities
│   ├── docs/               # Generated Swagger documentation
│   └── Makefile            # Backend build/dev commands
└── frontend/               # Next.js frontend application (Zenith Web)
    ├── src/
    │   ├── actions/        # Server actions
    │   ├── app/            # Next.js App Router (pages/layouts)
    │   ├── components/     # UI components (shadcn/ui)
    │   ├── hooks/          # Custom React hooks
    │   └── lib/            # Utilities and schemas (Zod)
    └── package.json        # Frontend dependencies and scripts
```

---

## Building and Running

### Prerequisites
- Go 1.22.2+
- Node.js & npm/pnpm
- Docker & Docker Compose (for PostgreSQL)

### Backend
Commands are managed via the `Makefile` in the `backend/` directory:
- **Development:** `make dev` (uses [air](https://github.com/cosmtrek/air) for hot-reload)
- **Test:** `make test`
- **Build:** `make build`
- **Run:** `make run`
- **Database (Docker):** `make docker-up` / `make docker-down`

### Frontend
Commands are run from the `frontend/` directory:
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Start:** `npm run start` (runs on port 3001)
- **Lint:** `npm run lint`

---

## Development Conventions

### Backend
- **Hexagonal Architecture:** Business logic MUST reside in `internal/core/service` and interact with adapters through interfaces defined in `internal/core/port`.
- **Validation:** Use struct tags with `github.com/go-playground/validator/v10`.
- **Error Handling:** Use custom error types defined in `internal/core/domain/error.go`.

### Frontend
- **Component Styling:** Use Tailwind CSS utility classes. Prefer components from `src/components/ui` (shadcn).
- **Type Safety:** Use TypeScript for all components and utilities. Define Zod schemas in `src/lib/schema` for form validation and API responses.
- **Data Fetching:** Prefer SWR for client-side fetching and Axios for mutations/server actions.
