import { useState, useEffect } from 'react'
import SearchBar from '../components/Jobs/SearchBar'
import JobList from '../components/Jobs/JobList'
import Filters from '../components/Jobs/Filters'
import { jobsAPI } from '../services/api'
import './Home.css'

const Home = () => {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    applyFiltersAndSearch()
  }, [jobs, searchQuery, filters])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await jobsAPI.getAll()
      setJobs(data)
      setFilteredJobs(data)
      setError('')
    } catch (err) {
      setError('Failed to load jobs. Please try again later.')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSearch = () => {
    let filtered = [...jobs]

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      )
    }

    // Apply location filter
    if (filters.location) {
      const location = filters.location.toLowerCase()
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(location)
      )
    }

    // Apply salary filter
    if (filters.salaryMin) {
      filtered = filtered.filter((job) => job.salary >= filters.salaryMin)
    }

    setFilteredJobs(filtered)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your <span className="hero-highlight">Dream Job</span>
          </h1>
          <p className="hero-subtitle">
            Discover opportunities that match your skills and ambitions.
            Your next career move is just a search away.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="hero-gradient"></div>
      </section>

      <section className="jobs-section">
        <div className="container">
          <div className="jobs-layout">
            <aside className="filters-sidebar">
              <Filters onFilterChange={handleFilterChange} filters={filters} />
            </aside>

            <div className="jobs-content">
              <JobList jobs={filteredJobs} loading={loading} error={error} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

