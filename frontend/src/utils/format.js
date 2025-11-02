/**
 * Utility functions for formatting data
 */

export const formatSalary = (salary) => {
  // Format number with Indian locale (comma separators) and add Rs. prefix
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(salary)
  return `Rs. ${formatted}`
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatRelativeDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Posted today'
  if (diffDays < 7) return `Posted ${diffDays} days ago`
  if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`
  return `Posted ${Math.floor(diffDays / 30)} months ago`
}

