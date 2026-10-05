# Final Year Project Report: Smart Fuel Station Management System

## 1. Abstract
The **Smart Fuel Station Management System** is a comprehensive, enterprise-level web application designed to automate and streamline the operations of a modern fuel station. Built using a robust microservices-inspired architecture with React.js on the frontend and Spring Boot on the backend, this system eliminates manual data entry, reduces human error, and provides real-time business intelligence. Key features include an automated Point of Sale (POS) system, real-time inventory tracking via Server-Sent Events (SSE), AI-assisted business analytics using Gemini AI, and automated stock procurement algorithms. The project serves as a complete digital transformation solution for fuel station management.

---

## 2. Technology Stack
- **Frontend (Client-Side)**: React.js, CSS3 (Enterprise Theme), Axios for API communication.
- **Backend (Server-Side)**: Java 17+, Spring Boot 3, Spring Security (JWT), Spring Data JPA.
- **Database**: MySQL (Relational Database Management System).
- **AI Integration**: Google Gemini 2.0 API.
- **Real-Time Communication**: Server-Sent Events (SSE).
- **Build Tools**: Maven (Backend), npm (Frontend).

---

## 3. System Architecture
The system follows a strict **Client-Server Architecture** using RESTful principles.

1. **Presentation Layer (React)**: Handles the User Interface, state management, and real-time dashboard rendering.
2. **Security Layer (Spring Security)**: Intercepts all incoming requests, validates JWT tokens, and enforces Role-Based Access Control (RBAC).
3. **Application Layer (Controllers & Services)**: Processes business logic (e.g., calculating GST, generating PDF invoices, querying the AI).
4. **Data Access Layer (JPA/Hibernate)**: Manages database transactions and object-relational mapping (ORM) to the MySQL database.

---

## 4. Module Descriptions

### 4.1 Authentication & Security Module
- Secures the application using JSON Web Tokens (JWT).
- Implements Role-Based Access Control (RBAC) with three distinct roles: `SUPER_ADMIN`, `MANAGER`, and `OPERATOR`.
- Protects API endpoints preventing unauthorized data manipulation.

### 4.2 Point of Sale (POS) & Billing Module
- Processes customer fuel purchases (Petrol/Diesel).
- Automatically calculates subtotal, GST (18%), and final payable amounts.
- Features one-click PDF invoice generation for customer receipts.

### 4.3 Real-Time Inventory & Dashboard Module
- Utilizes Server-Sent Events (SSE) to push live updates to the frontend dashboard without requiring manual page refreshes.
- Decrements fuel stock automatically upon every successful sale.
- Triggers low-stock alert notifications across the system.

### 4.4 Automated Procurement Module (Background Tasks)
- Features a `@Scheduled` background worker (`FuelReorderScheduler`) that constantly monitors stock levels.
- When stock dips below the designated threshold (e.g., 2000 Liters), it automatically generates a `PurchaseOrder` to the respective `Supplier`.

### 4.5 AI Assistant & Business Intelligence Module
- Integrates Google's Gemini AI directly into the dashboard.
- Analyzes raw sales data and generates natural-language business insights, performance summaries, and predictive stock warnings.

### 4.6 Presentation Simulation & Backup Module
- **Simulation Mode**: A dedicated background scheduler that generates virtual customer sales randomly every few minutes. This allows the system to operate autonomously for live demonstrations and examiner presentations.
- **Automated Backups**: A scheduled task that executes system-level `mysqldump` commands daily to ensure data integrity and disaster recovery.

---

## 5. Entity Relationship (ER) Data Model

Below is the text representation of the database tables and relationships to assist in drawing the final ER Diagram:

- **User**: (ID, Name, Email, Password, Role, Active)
- **Employee**: (ID, Name, Phone, Position, Salary, Active)
- **Fuel**: (ID, FuelType, Quantity, PricePerLiter, Supplier, MinimumThreshold, ReorderQuantity)
- **Sale**: (ID, BillNo, FuelType, CustomerName, Liters, Amount, TaxAmount, SaleDate)
- **Supplier**: (ID, Name, ContactPerson, ContactNumber, Email, Address, GstNumber)
- **PurchaseOrder**: (ID, Supplier_ID, FuelType, QuantityLiters, PricePerLiter, TotalAmount, Status, OrderDate)
- **TankerDelivery**: (ID, PurchaseOrder_ID, DriverName, VehicleNumber, LitersDelivered, Status, ArrivalTime)

### Key Relationships
- **Supplier (1) to (M) PurchaseOrder**: A single supplier can fulfill multiple purchase orders.
- **PurchaseOrder (1) to (1) TankerDelivery**: Every successful purchase order maps to a specific physical tanker delivery.

---

## 6. Conclusion
The Smart Fuel Station Management System successfully bridges the gap between physical fuel distribution and modern software automation. By integrating real-time web technologies and artificial intelligence, the system proves that legacy business operations can be drastically optimized for the digital age.
