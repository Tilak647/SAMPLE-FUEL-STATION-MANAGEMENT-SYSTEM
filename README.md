# ⛽ Smart Fuel Station Management System (Enterprise Edition)

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)
![AI](https://img.shields.io/badge/AI-Gemini_2.0-orange?logo=google&logoColor=white)

A comprehensive, full-stack enterprise web application designed to digitize and automate modern fuel station operations. This project replaces manual ledger tracking with an automated, AI-assisted point-of-sale and inventory management system. 

Designed and built as a fully-featured **Final Year Project**.

---

## 🚀 Key Features

*   **🔒 Secure Authentication**: Role-Based Access Control (RBAC) via JWT (Super Admin, Manager, Operator).
*   **💳 Automated Point of Sale (POS)**: Rapid billing with automatic GST calculations and instant PDF invoice generation.
*   **📊 Real-Time Dashboard**: Server-Sent Events (SSE) push live sales data to the frontend immediately without refreshing.
*   **🤖 AI Business Intelligence**: Integrated with Google Gemini AI to analyze raw sales data and provide plain-text business insights.
*   **📦 Automated Procurement**: Background schedulers detect low fuel stock and automatically generate Purchase Orders to designated suppliers.
*   **🎭 Presentation Simulation Mode**: A built-in scheduler that automatically generates virtual customer sales every few minutes, allowing the system to demonstrate itself autonomously!
*   **💾 Automated Daily Backups**: Safeguards database records via scheduled `mysqldump` processes.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js, CSS3 | Custom enterprise-grade dark theme UI with responsive design. |
| **Backend** | Spring Boot 3, Java 17 | REST API architecture serving secure endpoints. |
| **Security** | Spring Security, JWT | Token-based stateless authentication. |
| **Database** | MySQL, Spring Data JPA | Relational database mapping with Hibernate ORM. |
| **AI API** | Google Gemini API | Natural language processing for business analytics. |

---

## ⚙️ How to Run Locally

### Prerequisites
*   Node.js (v16+)
*   Java Development Kit (JDK 17+)
*   Maven
*   MySQL Server (Running on default port `3306`)

### Database Setup
1. Open MySQL and create a database named `fuelstation_db`.
2. The application will automatically create the tables and insert Demo Data (Admin user, dummy employees, stock, etc.) upon first boot.

### 1-Click Launch (Recommended for Windows)
If you are on Windows, simply double-click the `START_DEMO.bat` file located in the root directory. This script will automatically boot both the frontend and backend servers simultaneously.

### Manual Launch
**Backend:**
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

**Frontend:**
```bash
cd Frontend
npm install
npm start
```

### Default Login
*   **Email**: `admin@test.com`
*   **Password**: `admin123`

---

## 👨‍💻 Project Structure Overview
*   `/backend`: Spring Boot application containing all Controllers, Services, Security Filters, and automated Schedulers.
*   `/Frontend`: React application containing components, layout views, and API communication logic (Axios).
*   `PROJECT_REPORT.md`: A detailed documentation file generated specifically for final year thesis reporting.

---

> **Note**: For the AI Assistant to function properly, you must supply a valid Gemini API Key as an environment variable (`GEMINI_API_KEY=your_key_here`). If absent, the system gracefully falls back to mock responses.
