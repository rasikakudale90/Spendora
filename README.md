# Spendora — Personal Finance Management Platform

[![CI Pipeline](https://github.com/spendora/spendora/actions/workflows/ci.yml/badge.svg)](https://github.com/spendora/spendora/actions/workflows/ci.yml)

Spendora is a modern personal finance management platform designed to help users track expenses, monitor budgets, analyze spending trends, and make better financial decisions.

---

## 🚀 Features (V1 – V3 Scope)

- **Version 1 — Core Expense Tracker**: Full Expense CRUD, category categorization, date/category filtering, and summary statistics.
- **Version 2 — Efficient Expense Management**: Search by title & description, date & amount range filters, multi-field sorting, and paginated API endpoints & UI controls.
- **Version 3 — Analytics & Budgeting**: Visual spending trends (daily, weekly, monthly), category distribution, and budget tracking with dynamic utilization indicators (alerting at >80% and >100%).

---

## 🛠️ Tech Stack

- **Backend**: Java 17, Spring Boot 3.x, Spring Data JPA, Hibernate, PostgreSQL Driver, Spring Boot Actuator, OpenAPI / Swagger UI.
- **Frontend**: React SPA, Vite, Vanilla CSS with OKLCH token-based design system, Recharts, Lucide Icons.
- **Database**: PostgreSQL (UUID PKs) with versioned SQL migrations.
- **Deployment & Infra**:
  - Database: **Supabase** (Managed PostgreSQL)
  - Backend: **Docker → Render** (Containerized Web Service)
  - Frontend: **Vercel** (Edge static hosting)
  - Local Orchestration: **Docker Compose**

---

## 📂 Repository Structure

```
spendora/
├── backend/          # Java Spring Boot REST API Service
├── frontend/         # React SPA (Vite + Vanilla CSS design system)
├── database/         # SQL Migrations (V1, V2, V3)
├── postman/          # API Collections & Environment definitions
├── docs/             # Product Roadmap & Software Requirements Specification
├── docker-compose.yml# Local Docker setup
├── render.yaml       # Render Blueprint configuration
└── README.md
```

---

## 💻 Local Development Setup

### Prerequisites
- JDK 17+
- Maven 3.8+
- Node.js 18+ & npm
- Docker & Docker Compose

### 1. Running via Docker Compose (Recommended)
```bash
docker-compose up --build
```
This spins up PostgreSQL on port `5432` and the Spring Boot backend on port `8080`.

### 2. Running Backend Manually
```bash
cd backend
cp .env.example .env
mvn spring-boot:run
```

### 3. Running Frontend Manually
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📄 License
MIT License. Developed for the Spendora project.
