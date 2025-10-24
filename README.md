# 👨‍💻 USER_API: RESTful User Management API (Node.js & SQL Server)

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue?logo=express)](https://expressjs.com/)
[![SQL Server](https://img.shields.io/badge/Database-SQL%20Server-red?logo=microsoft-sql-server)](https://www.microsoft.com/en-us/sql-server)

This project is a modern RESTful API built with **Node.js** and **Express.js**, utilizing **Microsoft SQL Server** as the primary data storage system. The API provides standard Endpoints to perform CRUD (Create, Read, Update, Delete) operations on user data.

---

## ✨ Technologies & Tools

Below is an overview of the core technologies and supporting tools used in this project:

| Type | Technology/Tool | Description |
| :--- | :--- | :--- |
| **Runtime & Language** | **Node.js 22.21.0**, **JavaScript (ESM)** | Server runtime environment and utilizes the modern ECMAScript module standard. |
| **Web Framework** | **Express.js** | Builds the REST API architecture, manages routing and middleware. |
| **Database** | **Microsoft SQL Server** | Relational database used for storing `Users` data. |
| **SQL Driver** | **`mssql`** | Official driver for connecting Node.js to SQL Server and executing queries/Stored Procedures. |
| **Code Quality** | **ESLint** | Checks syntax, detects potential errors, and enforces code style. |
| **Code Formatting** | **Prettier** | Automatically formats code to ensure consistency (works integrated with ESLint). |
| **Development** | **`nodemon`**, **`dotenv`** | Automatically reloads the server when code changes; manages and loads environment variables from the `.env` file. |
| **Testing & Debug** | **Postman**, **Node.js Debugger** | Uses Postman for testing Endpoints; Debugger for runtime error detection. |

---

## ⚙️ Requirements and Setup

### 1. System Requirements

* **Node.js v22.21.0** (or version 20+).
* **Microsoft SQL Server** instance.
* SQL Server account (e.g., `node_user`) using **SQL Server Authentication**.

### 2. Project Setup

**Clone the repository and install dependencies:**

```bash
git clone https://github.com/lljjkkss/USER_API.git
cd USER_API
npm install
```

**Set up the database:**

* Open SQL Server Management Studio (SSMS)
* Connect to your SQL Server instance
* Run the UserDBQuery.sql script included in the project to create:

```
Database UserDB
Table Users
```

### 3. Environment Configuration

**The .env file is already included and configured with your database credentials. Example structure:**

```
DB_USER = CREATED SQL SERVER LOGIN NAME
DB_PASSWORD = PASSWORD FOR THE DB_USER ACCOUNT
DB_SERVER = SERVER NAME OR IP OF THE SQL SERVER INSTANCE
# EXAMPLE: LOCALHOST, 192.168.X.X, OR YOUR_COMPUTER_NAME\SQLEXPRESS
DB_PORT = SQL SERVER CONNECTION PORT
DB_DATABASE = USERDB
DB_ENCRYPT = FALSE
# SET 'TRUE' IF THE CONNECTION REQUIRES SSL/TLS ENCRYPTION, 'FALSE' OTHERWISE
TRUST_SERVER_CERTIFICATE = TRUE
# SET 'TRUE' TO SKIP SERVER CERTIFICATE CHECK (COMMONLY USED IN DEV ENVIRONMENTS)
```

### 4. Starting the Server

After configuring the .env file, use the dev script to start the server:
```
npm run dev
```
### 🧭 API Endpoints

Use Postman or any API testing tool to interact with the following routes (Endpoints). All use the /api/users prefix.

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| **`POST`** | `/api/users` | Add a new user | `JSON: { "name": "string", "email": "string" }` |
| **`GET`** | `/api/users` | Get all users | N/A |
| **`GET`** | `/api/users/:id` | Get a single user by ID | N/A |
| **`PUT`** | `/api/users/:id` | Update user info by ID | `JSON: { "name": "string", "email": "string" }` |
| **`DELETE`** | `/api/users/:id` | Soft delete a user | N/A |

### 🧹 Code Quality

The project includes scripts to check code quality and formatting.

| Command | Description |
| :--- | :--- |
| `npm run lint` | Run **ESLint** to scan the source code and report errors/warnings. |
| `npm run format` | Run **Prettier** to auto-format code. |
