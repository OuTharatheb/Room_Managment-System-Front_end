import { useState } from 'react'
import './Guest.css'

export default function Guest() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const guests = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1-555-0101', totalVisits: 5, lastVisit: '2026-03-21', status: 'regular', joinDate: '2025-06-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0102', totalVisits: 3, lastVisit: '2026-03-25', status: 'regular', joinDate: '2025-11-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1-555-0103', totalVisits: 1, lastVisit: '2026-03-26', status: 'new', joinDate: '2026-03-20' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1-555-0104', totalVisits: 8, lastVisit: '2026-03-20', status: 'vip', joinDate: '2024-12-10' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', phone: '+1-555-0105', totalVisits: 2, lastVisit: '2026-03-19', status: 'regular', joinDate: '2026-01-05' },
  ]

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || guest.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { label: '🆕 New Guest', color: '#06b6d4' },
      'regular': { label: '⭐ Regular', color: '#FDB022' },
      'vip': { label: '👑 VIP', color: '#d97706' },
    }
    return statusConfig[status] || { label: status, color: '#666' }
  }

  return (
    <div className="guests-management">
      {/* Header */}
      <div className="guests-header">
        <div className="header-content">
          <h1>👥 Guest Profiles</h1>
          <p>View guest history and check if they've visited before</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="guests-main">
        {/* Guests Section */}
        <div className="guests-section">
          <div className="section-header">
            <h2>🏨 All Guests ({filteredGuests.length})</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Guests</option>
                <option value="new">New</option>
                <option value="regular">Regular</option>
                <option value="vip">VIP</option>
              </select>
            </div>
          </div>

          {/* Guests Table */}
          <div className="guests-container">
            {filteredGuests.length === 0 ? (
              <div className="empty-state">
                <p>No guests found.</p>
              </div>
            ) : (
              <div className="guests-table-wrapper">
                <table className="guests-table">
                  <thead>
                    <tr>
                      <th>Guest Name</th>
                      <th>Contact</th>
                      <th>Total Visits</th>
                      <th>Last Stay</th>
                      <th>Status</th>
                      <th>Member Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGuests.map(guest => {
                      const statusBadge = getStatusBadge(guest.status)
                      return (
                        <tr key={guest.id} className="guest-row">
                          <td className="guest-name-cell">
                            <div className="guest-name">{guest.name}</div>
                          </td>
                          <td className="contact-cell">
                            <div className="email">{guest.email}</div>
                            <div className="phone">{guest.phone}</div>
                          </td>
                          <td className="visits-cell">
                            <span className="visits-badge">{guest.totalVisits}</span>
                            {guest.totalVisits > 5 && '⭐'}
                          </td>
                          <td className="last-visit-cell">
                            {new Date(guest.lastVisit).toLocaleDateString()}
                          </td>
                          <td className="status-cell">
                            <span 
                              className="status-badge" 
                              style={{ color: statusBadge.color }}
                            >
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="join-date-cell">
                            {new Date(guest.joinDate).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
