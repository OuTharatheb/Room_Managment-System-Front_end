import { useEffect, useMemo, useState } from 'react'
import './Guest.css'

export default function Guest() {
  const [bookingsVersion, setBookingsVersion] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const onBookingsUpdated = () => setBookingsVersion(v => v + 1)
    window.addEventListener('bookings-updated', onBookingsUpdated)
    window.addEventListener('storage', onBookingsUpdated)

    return () => {
      window.removeEventListener('bookings-updated', onBookingsUpdated)
      window.removeEventListener('storage', onBookingsUpdated)
    }
  }, [])

  const guests = useMemo(() => {
    void bookingsVersion

    const activeBookings = JSON.parse(localStorage.getItem('activeBookings') || '[]')
    const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
    const allBookings = [...activeBookings, ...bookingHistory]

    const guestMap = new Map()

    for (const booking of allBookings) {
      const name = booking.guestName || ''
      if (!name.trim()) continue

      const email = booking.email || booking.guestEmail || '-'
      const phone = booking.phone || booking.guestPhone || '-'
      const normalizedKey = `${name.trim().toLowerCase()}|${String(email).trim().toLowerCase()}|${String(phone).trim().toLowerCase()}`

      const checkInDate = booking.checkInDate || null
      const checkOutDate = booking.checkOutDate || null
      const visitDate = checkOutDate || checkInDate

      if (!guestMap.has(normalizedKey)) {
        guestMap.set(normalizedKey, {
          id: normalizedKey,
          name,
          email,
          phone,
          totalVisits: 0,
          lastVisit: visitDate,
          joinDate: checkInDate,
        })
      }

      const guest = guestMap.get(normalizedKey)
      guest.totalVisits += 1

      if (visitDate && (!guest.lastVisit || new Date(visitDate) > new Date(guest.lastVisit))) {
        guest.lastVisit = visitDate
      }

      if (checkInDate && (!guest.joinDate || new Date(checkInDate) < new Date(guest.joinDate))) {
        guest.joinDate = checkInDate
      }
    }

    return Array.from(guestMap.values())
      .map((guest) => {
        const status = guest.totalVisits >= 6 ? 'vip' : guest.totalVisits >= 2 ? 'regular' : 'new'
        return {
          ...guest,
          status,
          lastVisit: guest.lastVisit || guest.joinDate || null,
          joinDate: guest.joinDate || guest.lastVisit || null,
        }
      })
      .sort((a, b) => {
        const aDate = a.lastVisit ? new Date(a.lastVisit).getTime() : 0
        const bDate = b.lastVisit ? new Date(b.lastVisit).getTime() : 0
        return bDate - aDate
      })
  }, [bookingsVersion])

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm)
    const matchesStatus = filterStatus === 'all' || guest.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { label: 'New Guest', color: '#06b6d4' },
      'regular': { label: 'Regular', color: '#FDB022' },
      'vip': { label: 'VIP', color: '#d97706' },
    }
    return statusConfig[status] || { label: status, color: '#666' }
  }

  return (
    <div className="guests-management">
      {/* Header */}
      <div className="guests-header">
        <div className="header-content">
          <h1>Guest Profiles</h1>
          <p>View guest history and check if they've visited before</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="guests-main">
        {/* Guests Section */}
        <div className="guests-section">
          <div className="section-header">
            <h2>All Guests ({filteredGuests.length})</h2>
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
                            {guest.totalVisits > 5 && ' Frequent'}
                          </td>
                          <td className="last-visit-cell">
                            {guest.lastVisit ? new Date(guest.lastVisit).toLocaleDateString() : '-'}
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
                            {guest.joinDate ? new Date(guest.joinDate).toLocaleDateString() : '-'}
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
