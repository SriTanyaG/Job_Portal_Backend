
# 🧑‍💻 Job Portal Backend

A backend system built using **Django** and **Django REST Framework** to manage job postings and applications, supporting different user roles like Employers and Applicants.

---

## 🚀 Features

- RESTful API with full CRUD operations
- Role-based access: Employers can post jobs, Applicants can apply
- Modular architecture: Users, Jobs, Applications
- SQLite database integration (development-ready)
- Custom user model with email-based authentication
- Swagger/OpenAPI API documentation at `/swagger/`
- Testing setup using Pytest and Django's test framework

---

## 🧱 Tech Stack

- Python
- Django & Django REST Framework
- SQLite (default dev database)
- drf-yasg (Swagger for API docs)
- Pytest (unit & API testing)

---

## 📂 Project Structure

```bash
├── users/             # Handles registration, login, and custom user logic
├── jobs/              # Job management APIs
├── applications/      # Job application logic
├── config/            # Project settings and routing
├── db.sqlite3         # SQLite database (default)
├── requirements.txt   # Python dependencies
├── pytest.ini         # Pytest configuration
└── README.md
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/job-portal.git
cd job-portal/job_portal_backend
```

2. **Set up a virtual environment & install dependencies**

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Apply migrations and run the server**

```bash
python manage.py migrate
python manage.py runserver
```

4. **API Documentation**

Visit: [http://localhost:8000/swagger/](http://localhost:8000/swagger/)

---

## 🔗 API Endpoints (Use in Postman)

### 🧑 Users

| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| POST   | `/users/register/`  | Register a new user    |
| POST   | `/users/login/`     | Log in an existing user |

**Sample Payload** (Register/Login)
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

---

### 💼 Jobs

| Method | Endpoint        | Description           |
|--------|-----------------|-----------------------|
| GET    | `/api/jobs/`    | List all job posts    |
| POST   | `/api/jobs/`    | Create a new job *(Employer only)* |

**Sample Payload** (POST `/api/jobs/`)
```json
{
  "title": "Software Engineer",
  "description": "Build and maintain backend systems.",
  "location": "Remote",
  "salary": "60000.00"
}
```

---

### 📄 Applications

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/api/applications/`  | View all applications                |
| POST   | `/api/applications/`  | Apply for a job *(Applicant only)*  |

**Sample Payload** (POST `/api/applications/`)
```json
{
  "job": 1,
  "resume": "upload_a_file_here"
}
```

---

## ✅ Testing

Run all tests with:

```bash
pytest
```

---

## 📄 License

This project is for educational and demonstration purposes.
