import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { jobsAPI, applicationsAPI } from '../services/api'
import './JobDetail.css'

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isApplicant } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applying, setApplying] = useState(false)
  const [resume, setResume] = useState(null)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const data = await jobsAPI.getById(id)
      setJob(data)
      setError('')
    } catch (err) {
      setError('Job not found or failed to load.')
      console.error('Error fetching job:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!isApplicant()) {
      alert('Only applicants can apply for jobs.')
      return
    }

    if (!resume) {
      alert('Please upload your resume.')
      return
    }

    try {
      setApplying(true)
      await applicationsAPI.create({
        job: parseInt(id), // Ensure job ID is an integer
        resume: resume,
      })
      alert('Application submitted successfully!')
      navigate('/dashboard')
    } catch (error) {
      let errorMessage = 'Failed to submit application. Please try again.'
      
      if (error.response?.data) {
        // Check for duplicate application error
        if (error.response.data.job && Array.isArray(error.response.data.job)) {
          errorMessage = error.response.data.job[0]
        } else if (error.response.data.job) {
          errorMessage = error.response.data.job
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
      console.error('Error applying:', error.response?.data || error)
    } finally {
      setApplying(false)
    }
  }

  const formatSalary = (salary) => {
    // Format number with Indian locale (comma separators) and add Rs. prefix
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary)
    return `Rs. ${formatted}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="job-detail-loading">
        <div className="loader"></div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="job-detail-error">
        <p>{error || 'Job not found'}</p>
        <Link to="/" className="btn-primary">
          Back to Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <Link to="/" className="back-link">
          ← Back to Jobs
        </Link>

        <div className="job-detail-header">
          <div>
            <h1 className="job-detail-title">{job.title}</h1>
            <div className="job-detail-meta">
              <span className="job-location">📍 {job.location}</span>
              <span className="job-salary">{formatSalary(job.salary)}</span>
              <span className="job-date">Posted {formatDate(job.posted_at)}</span>
            </div>
          </div>
        </div>

        <div className="job-detail-content">
          <div className="job-detail-main">
            <section className="job-section">
              <h2>Job Description</h2>
              <div className="job-description">
                {job.description.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>
          </div>

          <aside className="job-detail-sidebar">
            <div className="apply-card">
              {isAuthenticated && isApplicant() ? (
                <form onSubmit={handleApply} className="apply-form">
                  <h3>Apply for this position</h3>
                  <div className="form-group">
                    <label htmlFor="resume">Upload Resume</label>
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files[0])}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-apply"
                    disabled={applying}
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              ) : (
                <>
                  <h3>Interested in this position?</h3>
                  <p>Sign in or create an account to apply.</p>
                  <Link to="/login" className="btn-primary">
                    Sign In to Apply
                  </Link>
                </>
              )}
            </div>

            <div className="job-info-card">
              <h3>Job Details</h3>
              <div className="job-info-item">
                <span className="info-label">Salary</span>
                <span className="info-value">{formatSalary(job.salary)}</span>
              </div>
              <div className="job-info-item">
                <span className="info-label">Location</span>
                <span className="info-value">{job.location}</span>
              </div>
              <div className="job-info-item">
                <span className="info-label">Posted</span>
                <span className="info-value">{formatDate(job.posted_at)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default JobDetail

