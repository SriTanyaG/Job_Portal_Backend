import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { jobsAPI, applicationsAPI } from '../services/api'
import JobCard from '../components/Jobs/JobCard'
import './Dashboard.css'

const Dashboard = () => {
  const { user, isEmployer, isApplicant } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Default to 'applications' for both applicants and employers so applications show automatically
  const defaultTab = isApplicant() ? 'applications' : (isEmployer() ? 'applications' : 'overview')
  const [activeTab, setActiveTab] = useState(searchParams.get('action') || defaultTab)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
  })
  const [updatingStatusId, setUpdatingStatusId] = useState(null)
  const [loadingResumeId, setLoadingResumeId] = useState(null)
  const [creatingJob, setCreatingJob] = useState(false)
  const [resumeModal, setResumeModal] = useState({ open: false, url: null })

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (isEmployer()) {
        const jobsData = await jobsAPI.getAll()
        // Filter jobs by current user (employer)
        const myJobs = jobsData.filter((job) => job.employer === user.id)
        setJobs(myJobs)
        
        // Fetch applications for employer's jobs
        const appsData = await applicationsAPI.getAll()
        const applicationsList = Array.isArray(appsData) ? appsData : (appsData.results || [])
        setApplications(applicationsList)
      }
      if (isApplicant()) {
        const appsData = await applicationsAPI.getAll()
        // Handle array response (could be paginated or direct array)
        const applicationsList = Array.isArray(appsData) ? appsData : (appsData.results || [])
        setApplications(applicationsList)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingStatusId(applicationId)
      await applicationsAPI.update(applicationId, { status: newStatus })
      // Update local state instead of refetching all data (faster)
      setApplications(prevApps => 
        prevApps.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
      const errorMessage = error.response?.data?.detail || error.response?.data?.status?.[0] || 'Failed to update application status. Please try again.'
      alert(errorMessage)
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    try {
      setCreatingJob(true)
      await jobsAPI.create({
        ...jobFormData,
        salary: parseFloat(jobFormData.salary),
      })
      setShowJobForm(false)
      setJobFormData({ title: '', description: '', location: '', salary: '' })
      fetchData()
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          error.message || 
                          'Failed to create job. Please try again.'
      alert(errorMessage)
      console.error('Error creating job:', error.response?.data || error)
    } finally {
      setCreatingJob(false)
    }
  }
  
  const handleViewResume = async (applicationId) => {
    try {
      setLoadingResumeId(applicationId)
      const { applicationsAPI } = await import('../services/api')
      const data = await applicationsAPI.getById(applicationId)
      if (data.resume_url) {
        setResumeModal({ open: true, url: data.resume_url })
      } else {
        alert('Resume not available.')
      }
    } catch (err) {
      console.error('Error loading resume:', err)
      alert('Failed to load resume. Please try again.')
    } finally {
      setLoadingResumeId(null)
    }
  }
  
  const closeResumeModal = () => {
    setResumeModal({ open: false, url: null })
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.email}</p>
          </div>
          {isEmployer() && (
            <button
              onClick={() => {
                setShowJobForm(true)
                setActiveTab('post-job')
              }}
              className="btn-post-job"
            >
              + Post New Job
            </button>
          )}
        </div>

        <div className="dashboard-tabs">
          {isEmployer() && (
            <>
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                My Jobs
              </button>
              <button
                className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                Applications ({applications.length})
              </button>
              <button
                className={`tab ${activeTab === 'post-job' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('post-job')
                  setShowJobForm(true)
                }}
              >
                Post Job
              </button>
            </>
          )}
          {isApplicant() && (
            <button
              className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              My Applications
            </button>
          )}
        </div>

        <div className="dashboard-content">
          {isEmployer() && activeTab === 'overview' && (
            <div className="dashboard-section">
              <h2>My Job Postings</h2>
              {jobs.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't posted any jobs yet.</p>
                  <button
                    onClick={() => {
                      setActiveTab('post-job')
                      setShowJobForm(true)
                    }}
                    className="btn-primary"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="dashboard-grid">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          )}

          {isEmployer() && activeTab === 'post-job' && (
            <div className="dashboard-section">
              <h2>Post a New Job</h2>
              <form onSubmit={handleCreateJob} className="job-form">
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={jobFormData.title}
                    onChange={(e) =>
                      setJobFormData({ ...jobFormData, title: e.target.value })
                    }
                    required
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={jobFormData.location}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        location: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    value={jobFormData.salary}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        salary: e.target.value,
                      })
                    }
                    required
                    placeholder="e.g., 100000"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={jobFormData.description}
                    onChange={(e) =>
                      setJobFormData({
                        ...jobFormData,
                        description: e.target.value,
                      })
                    }
                    required
                    rows="8"
                    placeholder="Describe the role, requirements, and benefits..."
                  />
                </div>
                <button type="submit" className="btn-submit" disabled={creatingJob}>
                  {creatingJob ? (
                    <>
                      <span className="inline-spinner" style={{ marginRight: '0.5rem' }}></span>
                      Posting...
                    </>
                  ) : (
                    'Post Job'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Employer Applications View - Shows automatically */}
          {isEmployer() && activeTab === 'applications' && (
            <div className="dashboard-section">
              <h2>Job Applications</h2>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <p>No applications received yet.</p>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.map((app) => (
                    <div key={app.id} className="application-card employer-view">
                      <div className="application-header">
                        <div>
                          <h3>{app.job?.title || 'Job'}</h3>
                          <p className="applicant-name">
                            👤 {app.applicant_detail?.full_name || app.applicant_detail?.email || 'Applicant'}
                          </p>
                          <p className="application-meta">
                            Applied on {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={app.status || 'pending'}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                            className="status-select"
                            disabled={updatingStatusId === app.id}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          {updatingStatusId === app.id && (
                            <span className="inline-spinner" style={{ marginLeft: '0.5rem' }}></span>
                          )}
                        </div>
                      </div>
                      {app.cover_letter && (
                        <div className="cover-letter">
                          <strong>Cover Letter:</strong>
                          <p>{app.cover_letter}</p>
                        </div>
                      )}
                      <div className="resume-section">
                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Resume:</strong>
                        {app.has_resume ? (
                          <button
                            type="button"
                            className="btn-view resume-btn"
                            onClick={() => handleViewResume(app.id)}
                            disabled={loadingResumeId === app.id}
                          >
                            {loadingResumeId === app.id ? (
                              <>
                                <span className="inline-spinner" style={{ marginRight: '0.5rem' }}></span>
                                Loading...
                              </>
                            ) : (
                              '📄 View Resume'
                            )}
                          </button>
                        ) : (
                          <span className="resume-missing">
                            📄 Resume not available
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Applicant Applications View - Shows automatically */}
          {isApplicant() && activeTab === 'applications' && (
            <div className="dashboard-section">
              <h2>My Applications</h2>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't applied to any jobs yet.</p>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-primary"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.map((app) => (
                    <div key={app.id} className="application-card">
                      <div className="application-header">
                        <div>
                          <h3>{app.job?.title || app.job || 'Job'}</h3>
                          <span className={`status-badge status-${app.status || 'pending'}`}>
                            {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <p className="application-meta">
                        Applied on {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                      </p>
                      {app.job?.id ? (
                        <Link to={`/jobs/${app.job.id}`} className="btn-view">
                          View Job
                        </Link>
                      ) : (
                        <span className="btn-view" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                          View Job
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Resume Modal */}
      {resumeModal.open && resumeModal.url && (
        <div className="resume-modal-overlay" onClick={closeResumeModal}>
          <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <h3>Resume</h3>
              <button className="resume-modal-close" onClick={closeResumeModal}>×</button>
            </div>
            <div className="resume-modal-body">
              <iframe
                src={resumeModal.url}
                title="Resume"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

