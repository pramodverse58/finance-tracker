# Ledger — Personal Finance Tracker

Full-stack personal finance tracker: **React (Vite) + Spring Boot + Spring Security (JWT) + Spring Data JPA + PostgreSQL**.

```
finance-tracker/
├── backend/     Spring Boot API (Java 17, Maven)
├── frontend/    React app (Vite, Tailwind, Recharts)
└── docker-compose.yml   optional local Postgres
```

## Features

- **Auth** — signup/login, JWT issued on success, every API route scoped to the logged-in user
- **Dashboard** — income/expense totals, category pie chart, 6-month trend chart (Recharts)
- **Transactions** — add/edit/delete income & expenses with category, date, amount, note
- **Budgets** — set a monthly limit per category, see a progress bar and an over-budget alert
- **Reports** — download the month's transactions as CSV, or a formatted summary as PDF

---

## 1. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| JDK | 17+ | `java -version` to check |
| Maven | — | **not required** — the project includes the Maven Wrapper (`mvnw` / `mvnw.cmd`), which downloads the right Maven version automatically the first time you run it |
| Node.js | 18+ | `node -v` to check |
| PostgreSQL | 14+ | optional — you can run on H2 in-memory instead, zero install |
| VS Code | latest | with the extensions below |

## 2. Open the project in VS Code

1. Unzip the project and open the **`finance-tracker`** folder in VS Code (`File → Open Folder…`) — open the root, not `backend` or `frontend` individually, so the `.vscode/` settings apply.
2. VS Code will prompt you to install the recommended extensions (also listed in `.vscode/extensions.json`). Accept it. At minimum you want:
   - **Extension Pack for Java** (`vscjava.vscode-java-pack`) — gives you Maven, debugging, project explorer
   - **Spring Boot Extension Pack** (`vmware.vscode-spring-boot`) — run/debug Spring Boot apps, `application.yml` support
   - **Tailwind CSS IntelliSense** — autocomplete for the frontend's Tailwind classes
3. Give the Java extension a minute to index the `backend` folder the first time — you'll see "Java: Building Workspace" in the status bar.

## 3. Run the backend

You have two options. **Option A (H2) is the fastest way to try the app** — no database installation needed.

### Option A — H2 in-memory database (quick start)

Nothing to install. Data resets each time you restart the app.

**From VS Code:** open `backend/src/main/java/com/financetracker/FinanceTrackerApplication.java`, then use the Run/Debug panel and pick **"Backend (H2 - no DB install needed)"** from the dropdown (already configured in `.vscode/launch.json`), or just click the ▶ "Run" codelens above `main()` — then set the `SPRING_PROFILES_ACTIVE=h2` env var manually if you use the plain codelens instead of the launch config.

**From a terminal:**

macOS/Linux:
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

Windows (PowerShell or cmd):
```powershell
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
```

> The first run downloads Maven itself (via the wrapper) and then all the project's dependencies — this can take a minute or two and needs an internet connection. Subsequent runs are fast.

### Option B — PostgreSQL (persistent data)

**Easiest:** use the included Docker Compose file:
```bash
docker compose up -d
```
This starts Postgres on `localhost:5432` with database `finance_tracker`, user `postgres`, password `postgres` — matching the defaults already in `backend/src/main/resources/application.yml`.

**No Docker?** Install PostgreSQL locally and create the database yourself:
```sql
CREATE DATABASE finance_tracker;
```
Then, if your username/password differ from `postgres`/`postgres`, set env vars before running:
```bash
export DB_USERNAME=your_user
export DB_PASSWORD=your_password
```

**Run it:**

macOS/Linux: `./mvnw spring-boot:run`
Windows: `.\mvnw.cmd spring-boot:run`

Or in VS Code, use the **"Backend (PostgreSQL)"** launch configuration.

The API starts on **http://localhost:8080**. Tables are created automatically on first run (`ddl-auto: update`).

---

## 4. Run the frontend

Open a **second terminal** (keep the backend running in the first):

```bash
cd frontend
npm install
npm run dev
```

The app opens at **http://localhost:5173**. In dev mode, Vite proxies any `/api/*` request to `http://localhost:8080`, so the frontend and backend just work together with no extra config.

Create an account on the signup screen, then you're in.

---

## 5. Trying the API directly (optional)

With the backend running:

```bash
# Sign up
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Jane Doe","email":"jane@example.com","password":"password123"}'

# Response includes a "token" — use it for authenticated requests
curl http://localhost:8080/api/transactions \
  -H "Authorization: Bearer <token from above>"
```

The **REST Client** VS Code extension (in the recommended list) lets you save requests like this in a `.http` file and run them with a click, if you'd rather not use curl.

---

## 6. Building for production

**Backend:**
```bash
cd backend
./mvnw clean package        # Windows: .\mvnw.cmd clean package
java -jar target/finance-tracker-backend-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
```
This outputs static files to `frontend/dist/` — serve them with any static host (Nginx, Vercel, Netlify, etc.). Since the production build isn't served through the Vite dev proxy, set `VITE_API_BASE_URL` (see `frontend/.env.example`) to point at your deployed backend before building.

For a real deployment, also:
- Set `JWT_SECRET` to your own long random value (env var, don't commit it)
- Set `CORS_ORIGINS` to your frontend's real URL
- Point `DB_USERNAME` / `DB_PASSWORD` / the datasource URL at your production database

---

## 7. Project structure reference

```
backend/src/main/java/com/financetracker/
├── config/SecurityConfig.java        Spring Security + CORS setup
├── security/                         JWT filter, JWT util, UserDetailsService
├── model/                            User, Transaction, Budget entities
├── repository/                       Spring Data JPA repositories
├── dto/                              Request/response records & DTOs
├── service/                          Business logic (auth, transactions, budgets, dashboard, reports)
├── controller/                       REST endpoints
└── exception/                        Custom exceptions + global handler

frontend/src/
├── api/                               axios calls per resource
├── context/AuthContext.jsx            JWT session state
├── routes/ProtectedRoute.jsx          redirects unauthenticated users
├── components/                        layout, dashboard charts, transaction & budget UI
├── pages/                             Login, Signup, Dashboard, Transactions, Budgets, Reports
└── utils/format.js                    currency/month formatting helpers
```

## Troubleshooting

- **Backend won't start / "Failed to configure a DataSource"** — Postgres isn't running or reachable. Either start it (`docker compose up -d`) or switch to the H2 profile (Option A above).
- **Frontend shows network errors** — make sure the backend is running on port 8080 *before* starting `npm run dev`, and that nothing else is using ports 5173 or 8080.
- **401 errors after a while** — JWTs expire after 24 hours by default (`app.jwt.expiration-ms` in `application.yml`); just log in again.
- **`mvn` not recognized / "command not found"** — you don't need Maven installed at all. Use the wrapper instead: `./mvnw` on macOS/Linux, `.\mvnw.cmd` on Windows (both are in the `backend` folder). If you'd rather use a real `mvn` install, that works too, but it's optional — the wrapper commands throughout this README are the recommended path. The Java extension pack in VS Code also bundles its own Maven, so running/debugging from the editor's Run panel works either way.
- **Windows: "running scripts is disabled on this system" when running `.\mvnw.cmd`** — that PowerShell execution-policy message is for `.ps1` scripts; `mvnw.cmd` is a plain batch file and isn't affected. If you still hit a permissions error, try running it from `cmd.exe` instead of PowerShell, or run `powershell -ExecutionPolicy Bypass -File .\mvnw.cmd ...`.
