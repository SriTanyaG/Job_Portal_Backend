# 🧑‍💻 Job Portal - Full Stack Application

A complete job portal application with **Django REST Framework backend** and **React frontend**, supporting different user roles like Employers and Applicants.

**🌐 Live Deployment:**
- Frontend: Deployed on Vercel
- Backend: Deployed on Render
- Database: Supabase PostgreSQL

---

## 🚀 Features

* **Frontend (React + Vite)**
  * Modern, responsive UI with violet/white theme
  * Job browsing, search, and filtering
  * User authentication (Register/Login)
  * Role-based dashboards (Employer/Applicant)
  * Job application with resume upload
  * Resume viewing in modal
  * Real-time status updates
  * Loading indicators throughout

* **Backend (Django REST Framework)**
  * RESTful API with full CRUD operations
  * Role-based access control (Employers, Applicants)
  * Resumes stored in database (BinaryField)
  * Performance optimized (query optimization, deferred loading)
  * Swagger/OpenAPI documentation
  * Supabase PostgreSQL integration

---

## 🧱 Tech Stack

**Frontend:**
- React 18
- Vite
- React Router DOM
- Axios
- React Context API

**Backend:**
- Python
- Django & Django REST Framework
- Supabase PostgreSQL
- Gunicorn
- drf-yasg (Swagger)
- WhiteNoise (static files)

---

## 📂 Project Structure

```
Job_Portal_Backend/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── contexts/      # Auth context
│   └── package.json
├── users/                 # User management
├── jobs/                  # Job management
├── applications/          # Application management
├── config/                # Django settings
├── requirements.txt       # Python dependencies
└── README.md
```

---

## ⚙️ Local Development Setup

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/SriTanyaG/Job_Portal_Backend.git
cd Job_Portal_Backend
```

2. **Set up virtual environment**
```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure environment variables**
```bash
# Copy .env.example to .env and fill in your Supabase credentials
cp .env.example .env
```

4. **Run migrations**
```bash
python manage.py migrate
```

5. **Start the backend server**
```bash
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`
API docs at: `http://localhost:8000/swagger/`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy .env.example to .env.local
# Update VITE_API_URL if needed (defaults to http://localhost:8000/api)
```

4. **Start the development server**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- **Vercel** (Frontend)
- **Render** (Backend)

---

## 🔗 API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user

### Jobs
- `GET /api/jobs/` - List all jobs
- `GET /api/jobs/{id}/` - Get job details
- `POST /api/jobs/` - Create job (Employer only)
- `PUT /api/jobs/{id}/` - Update job (Owner only)
- `DELETE /api/jobs/{id}/` - Delete job (Owner only)

### Applications
- `GET /api/applications/` - List applications (filtered by role)
- `GET /api/applications/{id}/` - Get application details
- `POST /api/applications/` - Apply for job (Applicant only)
- `PATCH /api/applications/{id}/` - Update status (Employer) or details (Applicant)
- `DELETE /api/applications/{id}/` - Delete application (Applicant only)

---

## 📝 Sample Payloads

**Register User:**
```json
{
  "email": "employer@example.com",
  "password": "password123",
  "is_employer": true,
  "is_applicant": false
}
```

**Create Job:**
```json
{
  "title": "Software Engineer",
  "description": "Build and maintain backend systems.",
  "location": "Remote",
  "salary": "60000.00"
}
```

**Apply for Job:**
```form-data
job: 1
resume: [file upload]
```

---

## ✅ Testing

Run backend tests:
```bash
pytest
```

---

## 🔐 Security Features

- Password hashing with Django's default hashers
- Role-based permissions (Employer/Applicant)
- CORS configured for production
- Resumes stored securely in database
- Environment-based configuration

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🆘 Support

For issues or questions, please open an issue on GitHub.
