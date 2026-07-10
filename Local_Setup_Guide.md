# CREDPAY Capstone Project

# 01 - System Preparation and Local Setup Guide

---

# Objective

Before running the CREDPAY application, every student must prepare their development environment.

This document explains:

* Software prerequisites
* Installation steps
* Version verification
* Project import
* Database setup
* Running Java application
* Running Python application
* Running React application
* End-to-End verification

By the end of this guide, the application should run locally without Docker.

---

# 1. System Requirements

| Component        | Recommended                           |
| ---------------- | ------------------------------------- |
| Operating System | Windows 11 (64-bit)                   |
| RAM              | 8 GB Minimum (16 GB Recommended)      |
| Processor        | Intel i5 / AMD Ryzen 5 or above       |
| Storage          | Minimum 15 GB Free Space              |
| Internet         | Required for downloading dependencies |

---

# 2. Software Required

Install the following software before importing the project.

| Software           | Recommended Version | Purpose                      |
| ------------------ | ------------------- | ---------------------------- |
| Git                | Latest              | Clone and manage source code |
| Visual Studio Code | Latest              | Code Editor                  |
| Java JDK           | 21 LTS or above     | Run Spring Boot Application  |
| Apache Maven       | 3.9+                | Build Java Project           |
| Python             | 3.12+               | Run FastAPI Application      |
| Node.js            | 22 LTS or above     | Run React Application        |
| PostgreSQL         | 17+                 | Database                     |
| Postman            | Latest              | API Testing                  |

---

# 3. Installing the Required Software

## 3.1 Install Java JDK

### Why do we need Java?

The User Service is developed using Java Spring Boot.

Without Java, the backend application cannot run.

### Download

https://adoptium.net/

Download:

Temurin JDK 21 LTS

Install using default settings.

### Verify Installation

Open PowerShell.

Run:

```bash
java --version
```

Why?

Displays the installed Java Runtime version.

Expected Output:

```
openjdk 21.x
```

Now verify compiler.

```bash
javac --version
```

Why?

Confirms the Java Compiler is installed.

Expected:

```
javac 21.x
```

---

## 3.2 Install Apache Maven

### Why Maven?

Maven downloads project dependencies automatically and builds the Java application.

Download

https://maven.apache.org/download.cgi

Extract:

```
C:\tools\apache-maven
```

Configure:

Add Maven bin folder to PATH.

Example:

```
C:\tools\apache-maven\bin
```

Verify

```bash
mvn -version
```

Why?

Confirms Maven is correctly installed and detects the installed Java version.

Expected Output

```
Apache Maven 3.9.x

Java version 21
```

---

## 3.3 Install Python

### Why Python?

The Payment Service is developed using FastAPI.

Download

https://www.python.org/downloads/

During installation select:

✔ Add Python to PATH

Verify

```bash
python --version
```

Why?

Checks the installed Python version.

Expected

```
Python 3.12+
```

Verify pip

```bash
pip --version
```

Why?

pip installs Python packages required by the application.

---

## 3.4 Install Node.js

### Why Node.js?

React applications require Node.js and npm.

Download

https://nodejs.org/

Install the LTS version.

Verify Node

```bash
node --version
```

Why?

Displays the installed Node.js version.

Verify npm

```bash
npm --version
```

Why?

npm is the package manager used to install React libraries.

---

## 3.5 Install PostgreSQL

### Why PostgreSQL?

Stores application data.

Tables:

* users

* cards

* payments

Download

https://www.postgresql.org/download/

Install PostgreSQL 17.

During installation remember:

* Username

* Password

* Port (5432)

Verify

```bash
psql --version
```

Why?

Confirms PostgreSQL Client Tools are installed.

---

## 3.6 Install Postman

### Why Postman?

Used for testing REST APIs independently before integrating the frontend.

Download

https://www.postman.com/downloads/

Install using default settings.

---

# 4. Verify Software Installation

Run the following commands.

| Command          | Purpose                       |
| ---------------- | ----------------------------- |
| java --version   | Verify Java Runtime           |
| javac --version  | Verify Java Compiler          |
| mvn -version     | Verify Maven Installation     |
| python --version | Verify Python                 |
| pip --version    | Verify Python Package Manager |
| node --version   | Verify Node.js                |
| npm --version    | Verify Node Package Manager   |
| psql --version   | Verify PostgreSQL Client      |

If every command returns a version number, the development environment is ready.

---

# 5. Import the Project

Open Visual Studio Code.

Select:

File

Open Folder

Choose:

CredPay

Project Structure

```
CredPay

├── frontend-react

├── user-service

├── payment-service

├── database

├── API_DOCUMENTATION.md

├── PROJECT_TRACKER.md
```

---

# 6. Configure PostgreSQL Database

Start PostgreSQL Service.

Open PowerShell.

Create Database

psql -U postgres


```sql
CREATE DATABASE credpay;
```

Why?

Creates a new database for the application.

Import schema

```bash
psql -U postgres -d credpay -f schema.sql
```

Why?

Creates all required tables and inserts sample data.

Verify

```sql
SELECT * FROM users;

SELECT * FROM cards;

SELECT * FROM payments;
```

Why?

Ensures the database schema and sample records were imported successfully.

---

# 7. Running the User Service

Navigate

```bash
cd user-service
```

Why?

Moves into the Spring Boot project directory.

Build the project

```bash
mvn clean compile
```

Why?

* Downloads project dependencies.
* Compiles all Java source files.
* Detects compilation errors before running.

Run Application

```bash
mvn spring-boot:run
```

Why?

Starts the embedded Spring Boot server (Tomcat) on port 8080.

Verify

Open:

http://localhost:8080

The application should start successfully.

---

# 8. Running the Payment Service

Navigate

```bash
cd payment-service
```

Create Virtual Environment

```bash
python -m venv .venv
```

Why?

Creates an isolated Python environment so project dependencies do not affect other Python projects.

Activate Virtual Environment

Windows

```powershell
.\.venv\Scripts\Activate.ps1
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Why?

Downloads all Python libraries required by FastAPI.

Run Application

```bash
uvicorn app.main:app --reload --port 8000
```

Why?

Starts the FastAPI application with automatic reload during development.

Verify

Open

http://localhost:8000/docs

Swagger documentation should appear.

---

# 9. Running the React Frontend

Navigate

```bash
cd frontend-react
```

Install Packages

```bash
npm install
```

Why?

Downloads all React dependencies defined in package.json.

Run Application

```bash
npm run dev
```

Why?

Starts the Vite development server on port 5173.

Verify

Open

http://localhost:5173

The CREDPAY application should load.

---

# 10. Verify Running Applications

| Component       | URL                        |
| --------------- | -------------------------- |
| React Frontend  | http://localhost:5173      |
| User Service    | http://localhost:8080      |
| Payment Service | http://localhost:8000      |
| FastAPI Swagger | http://localhost:8000/docs |

---

# 11. Perform End-to-End Testing

Verify the following workflow.

1. Register a User

↓

2. Login

↓

3. Dashboard Opens

↓

4. Add Credit Card

↓

5. Pay Credit Card Bill

↓

6. Success Screen

↓

7. View Payment History

---

# 12. Common Troubleshooting

## Maven Not Found

Run:

```bash
mvn -version
```

If not found, ensure the Maven **bin** directory is added to the system PATH.

---

## Java Not Found

Verify JAVA_HOME points to the installed JDK directory and that the JDK **bin** directory is available in PATH.

---

## Python Packages Missing

Run:

```bash
pip install -r requirements.txt
```

This installs any missing Python dependencies.

---

## npm Packages Missing

Run:

```bash
npm install
```

This restores all Node.js packages defined in `package.json`.

---

## PostgreSQL Connection Failed

Verify:

* PostgreSQL service is running.
* Username and password are correct.
* Database name is **credpay**.
* Port **5432** is not blocked.

---

# Congratulations

Your development environment is now fully prepared.

You have successfully installed all required software, configured the database, and run the complete CREDPAY application locally.
