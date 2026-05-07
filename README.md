# 💼 Employee Payroll System

A full-featured **Spring Boot REST API** for managing employees, payroll, and payslips — secured with **JWT authentication** and **role-based access control**.

---

## 🚀 Features

- 🔐 JWT-based Authentication & Authorization
- 👤 Role-based Access Control (ADMIN / EMPLOYEE)
- 👨‍💼 Employee Management (CRUD)
- 💰 Payroll Management with Net Salary Calculation
- 🧾 Payslip Generation per Month
- ⚠️ Global Exception Handling with meaningful error responses

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3 |
| Security | Spring Security + JWT |
| Database | MySQL |
| ORM | Spring Data JPA / Hibernate |
| Build Tool | Maven |

---

## 📁 Project Structure

```
src/main/java/com/employee_payroll/Employee/
├── controller/
│   ├── AuthController.java
│   ├── EmployeeController.java
│   └── PayrollController.java
├── exceptionHandler/
│   ├── DuplicateResourceException.java
│   ├── ResourceNotFoundException.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
├── model/
│   ├── Employee.java
│   ├── Payroll.java
│   ├── Payslip.java
│   ├── User.java
│   └── enums/ (Role, EmployeeType, Month)
├── repository/
│   ├── EmployeeRepo.java
│   ├── PayrollRepo.java
│   └── UsersRepo.java
├── security/
│   ├── CustomUserDetailsService.java
│   ├── JwtFilter.java
│   ├── JwtUtil.java
│   └── SecurityConfig.java
└── service/
    ├── EmployeeService.java
    └── PayrollService.java
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+
- MySQL
- Maven

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Employee-Payroll.git
cd Employee-Payroll
```

### 2. Create the database
```sql
CREATE DATABASE payroll_db;
```

### 3. Configure `application.properties`
Create `src/main/resources/application.properties`:
```properties
spring.application.name=Employee-Payroll

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/payroll_db
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
jwt.secret=your_jwt_secret
jwt.expiration=86400000
```

### 4. Run the application
```bash
mvn spring-boot:run
```
App runs on **http://localhost:8080**

---

## 🔑 Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin1",
  "password": "pass123",
  "role": "ADMIN"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin1",
  "password": "pass123"
}
```
Returns a JWT token — use it in all subsequent requests:
```
Authorization: Bearer <your_token>
```

---

## 📋 API Endpoints

### 👨‍💼 Employee (ADMIN only for write operations)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/employee` | Get all employees | ADMIN, EMPLOYEE |
| GET | `/api/employee/{id}` | Get employee by ID | ADMIN, EMPLOYEE |
| POST | `/api/employee` | Add new employee | ADMIN |
| PUT | `/api/employee/{id}` | Update employee | ADMIN |
| DELETE | `/api/employee/{id}` | Delete employee | ADMIN |

### Add Employee — Request Body
```json
{
  "name": "Rahul Sharma",
  "email": "rahul.sharma@gmail.com",
  "phone": "9876543210",
  "department": "IT",
  "employeeType": "FULL_TIME",
  "basicSalary": 50000.0
}
```

> `employeeType` values: `FULL_TIME`, `PART_TIME`, `CONTRACT`

---

### 💰 Payroll (ADMIN only for write operations)

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/payroll` | Get all payrolls | ADMIN, EMPLOYEE |
| GET | `/api/payroll/{id}` | Get payroll by ID | ADMIN, EMPLOYEE |
| POST | `/api/employee/{id}/payroll` | Add payroll for employee | ADMIN |
| PUT | `/api/payroll/{id}` | Update payroll | ADMIN |
| DELETE | `/api/payroll/{id}` | Delete payroll | ADMIN |

---

## 🔒 Role-Based Access

| Action | ADMIN | EMPLOYEE |
|---|---|---|
| View employees & payroll | ✅ | ✅ |
| Add / Edit / Delete employee | ✅ | ❌ |
| Manage payroll | ✅ | ❌ |
| Register & Login | ✅ | ✅ |

---

## ⚠️ Error Responses

| Status | Meaning |
|---|---|
| 401 Unauthorized | Missing or invalid JWT token |
| 403 Forbidden | You don't have permission for this action |
| 404 Not Found | Resource not found |
| 409 Conflict | Duplicate resource |

---

## 👨‍💻 Vinayaka Sai

Built with ❤️ using Spring Boot