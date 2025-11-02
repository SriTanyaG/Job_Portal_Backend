# Job Portal Frontend

A modern, sleek React frontend for the Job Portal application with a violet and white color scheme.

## Features

- 🎨 Modern, motivating UI with violet/white color palette
- 🔍 Job search and filtering
- 👤 User authentication (Login/Register)
- 💼 Employer dashboard for posting and managing jobs
- 📝 Applicant dashboard for viewing applications
- 📱 Responsive design for all devices
- ⚡ Fast and smooth interactions

## Tech Stack

- **React 18** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **CSS3** - Styling with custom violet theme

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Auth/         # Authentication components
│   │   ├── Jobs/         # Job-related components
│   │   └── Layout/       # Layout components (Navbar, Footer)
│   ├── contexts/         # React contexts (AuthContext)
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Design System

### Colors
- **Primary Violet**: `#6C63FF`
- **Secondary Lavender**: `#E8E6FF`
- **Text Gray**: `#555`
- **White**: `#ffffff`

### Typography
- **Headings**: Poppins
- **Body**: Inter

## API Integration

The frontend communicates with the Django REST API backend. Make sure the backend is running on `http://localhost:8000` (or configure via `.env`).

## Features in Detail

### Authentication
- User registration with role selection (Employer/Applicant)
- Secure login with email and password
- Protected routes for authenticated users

### Job Listings
- Browse all available jobs (public access)
- Search jobs by title, description, or location
- Filter by location and minimum salary
- Responsive grid layout

### Dashboard
- **Employers**: Post new jobs, view their job postings
- **Applicants**: View their applications, apply to jobs

### Job Details
- Full job description
- Application form for applicants
- Job information sidebar

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Job Portal application.

