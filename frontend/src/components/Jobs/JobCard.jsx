import { Link } from 'react-router-dom'
import './JobCard.css'

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    // Format number with Indian locale (comma separators) and add Rs. prefix
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary)
    return `Rs. ${formatted}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Posted today'
    if (diffDays < 7) return `Posted ${diffDays} days ago`
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`
    return `Posted ${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <span className="job-salary">{formatSalary(job.salary)}</span>
      </div>
      
      <div className="job-card-body">
        <p className="job-description">
          {job.description.length > 150
            ? `${job.description.substring(0, 150)}...`
            : job.description}
        </p>
        
        <div className="job-meta">
          <span className="job-location">📍 {job.location}</span>
          <span className="job-date">{formatDate(job.posted_at)}</span>
        </div>
      </div>
      
      <div className="job-card-footer">
        <span className="job-type-badge">Full-time</span>
        <span className="job-arrow">→</span>
      </div>
    </Link>
  )
}

export default JobCard

