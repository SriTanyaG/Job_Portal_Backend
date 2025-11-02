# 🧑‍💻 Job Portal - Full Stack Application

A complete job portal application built with **Django REST Framework** backend and **React + Vite** frontend. The application supports role-based access for Employers and Applicants, allowing employers to post jobs and manage applications, while applicants can browse jobs, apply with resumes, and track their applications.

**🌐 Live Deployment:**
- Frontend: Deployed on **Vercel**
- Backend: Deployed on **Render**
- Database: **Supabase PostgreSQL**

---

## 🚀 Features

### Frontend Features
- **Modern UI/UX**: Beautiful violet and white theme with smooth animations
- **Job Browsing**: Browse all available jobs with search and filter functionality
- **User Authentication**: Secure registration and login system
- **Role-Based Dashboards**:
  - **Employers**: View posted jobs, manage applications, update status, view resumes
  - **Applicants**: View applied jobs, track application status
- **Job Applications**: Upload resumes (stored in database), apply to jobs
- **Resume Viewing**: Modal-based resume viewer with instant display
- **Real-Time Updates**: Loading indicators for all operations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Backend Features
- **RESTful API**: Full CRUD operations for jobs and applications
- **Role-Based Permissions**: Employers can post/manage jobs, Applicants can apply
- **Resume Storage**: Resumes stored directly in database (BinaryField) for security
- **Performance Optimized**: 
  - Query optimization with `select_related`
  - Deferred resume loading in list views
  - Direct dict serialization for faster responses
- **Database Integration**: Supabase PostgreSQL with fallback to SQLite
- **API Documentation**: Interactive Swagger UI at `/swagger/`
- **CORS Configured**: Ready for frontend-backend separation

---

## 🧱 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Context API** - State management for authentication

### Backend
- **Python 3.12+**
- **Django 4.x** - Web framework
- **Django REST Framework** - REST API framework
- **PostgreSQL** (Supabase) - Production database
- **SQLite** - Local development database
- **Gunicorn** - Production WSGI server
- **WhiteNoise** - Static file serving
- **drf-yasg** - Swagger/OpenAPI documentation
- **python-decouple** - Environment variable management
- **django-cors-headers** - CORS handling

---

## 📂 Project Structure

```
Job_Portal_Backend/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── Auth/           # Authentication components
│   │   │   ├── Jobs/           # Job-related components
│   │   │   └── Layout/         # Layout components (Navbar, Footer)
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx         # Job listing page
│   │   │   ├── JobDetail.jsx    # Job details and application
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Login.jsx        # Login page
│   │   │   └── Register.jsx      # Registration page
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   ├── services/            # API service layer
│   │   │   └── api.js           # Axios API client
│   │   └── utils/               # Utility functions
│   │       └── format.js        # Formatting utilities
│   ├── package.json
│   └── vite.config.js
│
├── users/                       # User management app
│   ├── models.py                # Custom User model
│   ├── views.py                 # Registration/Login views
│   ├── serializers.py           # User serializers
│   └── urls.py
│
├── jobs/                        # Job management app
│   ├── models.py                # Job model
│   ├── views.py                 # Job ViewSet
│   ├── serializers.py           # Job serializers
│   ├── permissions.py           # Job permissions
│   └── urls.py
│
├── applications/                # Application management app
│   ├── models.py                # Application model with resume storage
│   ├── views.py                 # Application ViewSet
│   ├── serializers.py           # Application serializers
│   └── urls.py
│
├── config/                      # Django project settings
│   ├── settings.py              # Django configuration
│   ├── urls.py                  # Main URL configuration
│   └── wsgi.py                  # WSGI application
│
├── requirements.txt             # Python dependencies
├── Procfile                     # Render deployment config
├── render.yaml                  # Render service configuration
├── DEPLOYMENT.md                # Deployment guide
└── README.md
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Python 3.12 or higher
- Node.js 18+ and npm
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/SriTanyaG/Job_Portal_Backend.git
cd Job_Portal_Backend
```

2. **Create and activate virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
# Copy .env.example to .env (if exists)
# Or create .env file with:
DEBUG=True
SECRET_KEY=your-secret-key-here

# For Supabase database (optional for local dev):
USE_SUPABASE_DB=True
SUPABASE_USER=postgres
SUPABASE_HOST=db.your-project-id.supabase.co
SUPABASE_PORT=5432
SUPABASE_USE_SSL=True
SUPABASE_DB=postgres
SUPABASE_PASSWORD=your-password
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser (optional)**
```bash
python manage.py createsuperuser
```

7. **Start the backend server**
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

3. **Configure environment variables** (optional)
```bash
# Create .env.local file:
VITE_API_URL=http://localhost:8000/api
```
(Defaults to `http://localhost:8000/api` if not set)

4. **Start the development server**
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🌐 Deployment

### Deployment Architecture
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Backend**: Render (automatic deployments from GitHub)
- **Database**: Supabase PostgreSQL

### Quick Deployment Steps

**For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

#### Backend (Render)
1. Connect GitHub repository to Render
2. Create Web Service
3. Set environment variables (Supabase credentials, CORS, etc.)
4. Deploy

#### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set Root Directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

---

## 🔗 API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user

### Jobs
- `GET /api/jobs/` - List all jobs (public)
- `GET /api/jobs/{id}/` - Get job details (public)
- `POST /api/jobs/` - Create job (Employer only)
- `PUT /api/jobs/{id}/` - Update job (Owner only)
- `PATCH /api/jobs/{id}/` - Partial update (Owner only)
- `DELETE /api/jobs/{id}/` - Delete job (Owner only)

### Applications
- `GET /api/applications/` - List applications (filtered by role)
- `GET /api/applications/{id}/` - Get application details
- `POST /api/applications/` - Apply for job (Applicant only, requires resume)
- `PATCH /api/applications/{id}/` - Update application status (Employer) or details (Applicant)
- `DELETE /api/applications/{id}/` - Delete application (Applicant only)

### Documentation
- `GET /swagger/` - Interactive API documentation (Swagger UI)

---

## 📝 Sample API Requests

### Register User
```bash
POST /api/users/register/
Content-Type: application/json

{
  "email": "employer@example.com",
  "password": "password123",
  "is_employer": true,
  "is_applicant": false
}
```

### Create Job
```bash
POST /api/jobs/
Authorization: Basic <base64-encoded-email:password>
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "description": "Build scalable backend systems using Django.",
  "location": "Remote",
  "salary": "120000.00"
}
```

### Apply for Job
```bash
POST /api/applications/
Authorization: Basic <base64-encoded-email:password>
Content-Type: multipart/form-data

job: 1
resume: [PDF file]
```

---

## 🔐 Security Features

- **Password Hashing**: Django's default PBKDF2 hasher
- **Role-Based Access Control**: Separate permissions for Employers and Applicants
- **CORS Configuration**: Configured for production with specific allowed origins
- **Environment Variables**: Sensitive data stored in environment variables
- **Resume Storage**: Resumes stored securely in database (not exposed via URLs)
- **Input Validation**: Comprehensive validation on all endpoints
- **Duplicate Prevention**: Unique constraint on applications (one per applicant per job)

---

## ⚡ Performance Optimizations

### Backend Optimizations
- **Query Optimization**: Uses `select_related()` to prevent N+1 queries
- **Deferred Loading**: Resume data deferred in list views (only loaded for detail views)
- **Optimized Serialization**: Direct dict construction instead of nested serializers
- **Reduced Payload Size**: Excludes heavy fields (resume binary data) from list responses

### Frontend Optimizations
- **Lazy Loading**: Resume URLs loaded only when viewing resumes
- **Local State Updates**: Status updates update local state instead of refetching
- **Efficient Filtering**: Client-side filtering for instant results

---

## 💾 Database Schema

### User Model
- `email` (unique)
- `is_employer` (boolean)
- `is_applicant` (boolean)

### Job Model
- `employer` (ForeignKey to User)
- `title` (CharField)
- `description` (TextField)
- `location` (CharField)
- `salary` (DecimalField)
- `posted_at` (DateTimeField, auto)

### Application Model
- `applicant` (ForeignKey to User)
- `job` (ForeignKey to Job)
- `resume_data` (BinaryField) - Resume file stored as binary
- `resume_filename` (CharField) - Original filename
- `resume_content_type` (CharField) - MIME type (e.g., application/pdf)
- `status` (CharField) - pending, reviewing, shortlisted, accepted, rejected
- `cover_letter` (TextField, optional)
- `applied_at` (DateTimeField, auto)
- `updated_at` (DateTimeField, auto)

**Constraints:**
- Unique together: `(applicant, job)` - One application per applicant per job

---

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest

# Run specific app tests
pytest users/
pytest jobs/
pytest applications/
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🛠️ Development Commands

### Backend
```bash
# Run migrations
python manage.py migrate

# Create migrations
python manage.py makemigrations

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run shell
python manage.py shell
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Dependencies

### Backend (requirements.txt)
```
django
djangorestframework
psycopg2-binary
drf-yasg
python-decouple
djangorestframework-simplejwt
gunicorn
whitenoise
django-cors-headers
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "vite": "^5.8.8",
    "@vitejs/plugin-react": "^4.2.1"
  }
}
```

---

## 🎨 UI Features

### Design
- **Color Scheme**: Violet (#6C63FF) and white with gradient accents
- **Typography**: Poppins for headings, Inter for body text
- **Components**: Modern cards, buttons, modals with smooth animations
- **Responsive**: Mobile-friendly layout with adaptive grid

### User Experience
- **Loading States**: Spinners for all async operations
- **Error Handling**: Clear error messages throughout
- **Form Validation**: Real-time validation on all forms
- **Status Indicators**: Visual badges for application status
- **Resume Viewing**: Modal-based PDF viewer

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🤝 Contributing

This is a personal project. For issues or questions, please open an issue on GitHub.

---

## 🔗 Quick Links

- **Repository**: https://github.com/SriTanyaG/Job_Portal_Backend
- **API Documentation**: `/swagger/` (when running locally or on Render)

---


## ✨ Recent Updates

- ✅ Complete React frontend with modern UI
- ✅ Resume storage in database (BinaryField)
- ✅ Performance optimizations (query optimization, deferred loading)
- ✅ Loading indicators for all operations
- ✅ Resume modal viewer
- ✅ Auto-display applications on dashboard
- ✅ Deployment configuration for Vercel and Render
- ✅ CORS and ALLOWED_HOSTS auto-configuration
