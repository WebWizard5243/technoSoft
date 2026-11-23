# Lead Manager CRM

A modern, full-stack Lead Management application designed to track, organize, and manage sales leads across their customer journey. Built with a Next.js (App Router) and Tailwind CSS frontend powered by a robust Express.js, PostgreSQL (Neon), and Zod backend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Deployment](#deployment)

---

## Features

- **Interactive Pipeline Metrics**: Real-time stat cards displaying lead counts across stages (*Total Leads*, *New Leads*, *Contacted*, *Qualified*, and *Lost*) that double as quick one-click status filters.
- **Full CRUD Capabilities**:
  - **Create Lead**: Add leads via a modal dialog with real-time field validation (10-digit phone number, lowercase email uniqueness, required fields).
  - **Read Leads**: Retrieve lead list sorted chronologically by creation timestamp with support for search and status filters.
  - **Update Lead**: In-place edit modal for updating contact information, lead source, and stage.
  - **Delete Lead**: Remove outdated or obsolete leads from the database.
- **Search & Filtering**: Multi-field search across lead name, email, phone number, company, and source combined with status widget filtering.
- **Input Validation & Safety**: Server-side validation using Zod schemas with error mapping returned directly to client forms.
- **Responsive UI**: Clean interface built with Tailwind CSS.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **Database Client**: `pg` (Node-Postgres Connection Pool)
- **Validation**: [Zod](https://zod.dev/)
- **CORS**: `cors` with multi-origin and preview deployment support

---

## Project Architecture

```text
technoSoft/
├── backend/
│   ├── .env                    # Backend environment configurations
│   ├── package.json            # Backend dependencies & scripts
│   └── server.js               # Express server, routes, & database logic
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── AddLeadModal.tsx    # Modal dialog for creating new leads
│   │   │   ├── EditLeadModal.tsx   # Modal dialog for editing existing leads
│   │   │   ├── StatCards.tsx       # Pipeline metric counters & filters
│   │   │   └── Table.tsx           # Lead records table & row actions
│   │   ├── globals.css         # Tailwind global styles
│   │   ├── layout.tsx          # Root application layout
│   │   └── page.tsx            # Main dashboard page
│   ├── .env                    # Frontend environment configurations
│   ├── package.json            # Frontend dependencies & scripts
│   ├── tsconfig.json           # TypeScript configuration
│   └── next.config.ts          # Next.js configuration
└── README.md
```

---

## Database Schema

The database utilizes a `leads` table in PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    company VARCHAR(255) NOT NULL,
    source VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Lead Status Options
- `New` (Default)
- `Contacted`
- `Qualified`
- `Lost`

### Lead Source Options
- `Website`
- `WhatsApp`
- `Instagram`
- `Phone Call`
- `Google Form`
- `Referral`

---

## API Documentation

Base URL (Local): `http://localhost:5001`

### 1. Health Check
- **Endpoint**: `GET /health`
- **Description**: Verifies server health and database connectivity.
- **Response** (`200 OK`):
  ```json
  {
    "ok": true,
    "db": "connected"
  }
  ```

---

### 2. Fetch Leads
- **Endpoint**: `GET /getLeads`
- **Query Parameters**:
  - `search` *(optional)*: Substring match against `name` (case-insensitive).
  - `status` *(optional)*: Filter leads by status (`New`, `Contacted`, `Qualified`, `Lost`).
- **Response** (`200 OK`):
  ```json
  [
    {
      "id": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "9876543210",
      "company": "Acme Corp",
      "source": "Website",
      "status": "New",
      "created_at": "2026-11-23T15:00:00.000Z"
    }
  ]
  ```

---

### 3. Add Lead
- **Endpoint**: `POST /addLeads`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543210",
    "company": "Acme Corp",
    "source": "Website",
    "status": "New"
  }
  ```
- **Validation Rules**:
  - `name`: String, 1–100 characters.
  - `email`: Valid email format (converted to lowercase). Must be unique.
  - `phone`: Exactly 10 digits (`^\d{10}$`).
  - `company`: Non-empty string.
  - `source`: Non-empty string.
  - `status`: Must be one of `['New', 'Contacted', 'Qualified', 'Lost']`. Defaults to `'New'`.
- **Response** (`201 Created`):
  ```json
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "9876543210",
    "company": "Acme Corp",
    "source": "Website",
    "status": "New",
    "created_at": "2026-11-23T15:30:00.000Z"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure:
    ```json
    {
      "errors": {
        "phone": ["phone number must contain at least 10 digits"]
      }
    }
    ```
  - `400 Bad Request`: Email conflict:
    ```json
    {
      "error": "A lead with this email already exists"
    }
    ```

---

### 4. Update Lead
- **Endpoint**: `PATCH /leads/:id`
- **Headers**: `Content-Type: application/json`
- **Request Body** *(partial fields allowed)*:
  ```json
  {
    "status": "Qualified",
    "company": "Updated Company Name"
  }
  ```
- **Response** (`200 OK`): Returns the updated lead record.
- **Error Responses**:
  - `400 Bad Request`: Invalid fields or email already exists.
  - `404 Not Found`: Lead ID does not exist.

---

### 5. Delete Lead
- **Endpoint**: `DELETE /deleteLeads/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": "lead deleted succesfully"
  }
  ```
- **Error Response** (`404 Not Found`):
  ```json
  {
    "error": "lead not found"
  }
  ```

---

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
DATABASE_STRING=postgresql://<username>:<password>@<host>/<database>?sslmode=require
```

### Frontend (`frontend/.env`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

---

## Getting Started

### Prerequisites
- Node.js (v18.x or newer recommended)
- npm, yarn, or pnpm
- Access to a PostgreSQL instance (e.g. [Neon](https://neon.tech))

---

### Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file in `backend/.env`:
   ```env
   PORT=5001
   DATABASE_STRING=your_postgres_connection_string_here
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```
   The backend will be running at `http://localhost:5001`.

---

### Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file in `frontend/.env`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

- **Frontend**: Designed to deploy easily on [Vercel](https://vercel.com). Configure the `NEXT_PUBLIC_BACKEND_URL` environment variable in your Vercel Project Settings.
- **Backend**: Can be hosted on [Render](https://render.com), [Railway](https://railway.app), or any Node.js hosting platform. Ensure your deployed frontend domain is included in the backend CORS whitelist inside `backend/server.js`.
- **Database**: Serverless PostgreSQL managed on [Neon](https://neon.tech).
