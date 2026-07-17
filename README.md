# Smart Fuel Station Management System

An Enterprise-grade Fuel Station Management platform powered by Spring Boot, React, and Google Gemini AI.

## Architecture
- **Frontend**: React.js with Framer Motion and Glassmorphism UI
- **Backend**: Spring Boot 3.3, Spring Security (JWT)
- **Database**: MySQL 8.0
- **AI Integration**: Google Gemini AI API
- **DevOps**: Docker, NGINX, Prometheus/Actuator Monitoring

---

## Production Deployment Guide

This system is fully containerized using Docker and orchestrated via Docker Compose.

### 1. Prerequisites
- Docker Engine & Docker Compose installed.
- A valid Google Gemini API Key.
- SMTP Credentials (e.g., Gmail App Password).

### 2. Configuration
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and fill in your secure details:
   - `DB_PASSWORD`: Set a strong password.
   - `JWT_SECRET`: Must be a long, secure base64 string.
   - `GEMINI_API_KEY`: Your AI Studio API Key.
   - `MAIL_*`: Your SMTP server details for automated reports.

### 3. Startup
Launch the entire stack in detached mode:
```bash
docker-compose up -d --build
```

This command will:
1. Start the **MySQL** database and initialize the `fuelstation` schema.
2. Compile and start the **Spring Boot Backend** (Port 8080).
3. Compile the **React Frontend** and serve it via **NGINX** (Port 80).

### 4. Accessing the Application
- **Main Web Interface**: `http://localhost` (or your server's IP/Domain).
- **Backend API Base**: `http://localhost/api/`

### 5. Monitoring & Logging
The production configuration enables comprehensive health checks and logging.
- **System Health**: View live health directly in the "Manager Control Center" via the frontend UI.
- **Actuator Endpoints**: Accessible directly at `http://localhost/actuator/health` and `http://localhost/actuator/prometheus`.
- **Logs**: Backend logs are persisted to a Docker volume and can be found in the `/app/logs` directory inside the backend container.
  - View live logs: `docker logs -f fuelstation-backend`

### 6. Graceful Shutdown
To stop the application without destroying data volumes:
```bash
docker-compose down
```
*(To completely wipe the database and logs, use `docker-compose down -v`)*
