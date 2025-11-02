import JobCard from './JobCard'
import './JobList.css'

const JobList = ({ jobs, loading, error }) => {
  if (loading) {
    return (
      <div className="job-list-loading">
        <div className="loader"></div>
        <p>Loading jobs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="job-list-error">
        <p>⚠️ {error}</p>
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="job-list-empty">
        <div className="empty-icon">📋</div>
        <h3>No jobs found</h3>
        <p>Try adjusting your search or check back later for new opportunities.</p>
      </div>
    )
  }

  return (
    <div className="job-list">
      <div className="job-list-header">
        <h2>Available Positions</h2>
        <span className="job-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</span>
      </div>
      <div className="job-list-grid">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

export default JobList

