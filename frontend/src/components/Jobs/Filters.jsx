import { useState } from 'react'
import './Filters.css'

const Filters = ({ onFilterChange, filters = {} }) => {
  const [location, setLocation] = useState(filters.location || '')
  const [salaryMin, setSalaryMin] = useState(filters.salaryMin || '')

  const handleApply = () => {
    onFilterChange({
      location: location.trim(),
      salaryMin: salaryMin ? parseFloat(salaryMin) : null,
    })
  }

  const handleClear = () => {
    setLocation('')
    setSalaryMin('')
    onFilterChange({})
  }

  return (
    <div className="filters-panel">
      <h3 className="filters-title">Filter Jobs</h3>
      
      <div className="filters-content">
        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="City or Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="salary">Minimum Salary</label>
          <input
            type="number"
            id="salary"
            placeholder="e.g., 50000"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />
        </div>

        <div className="filter-actions">
          <button onClick={handleApply} className="btn-apply">
            Apply Filters
          </button>
          <button onClick={handleClear} className="btn-clear">
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default Filters

