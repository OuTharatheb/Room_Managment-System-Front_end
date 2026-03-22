import { useState } from 'react'
import './History.css'

export default function History() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRoom, setFilterRoom] = useState('all')
  const bookingHistory = [
    { id: 1, guestName: 'John Doe', guestEmail: 'john@example.com', guestPhone: '+1-555-0101', roomNo: 'Room 101', checkInDate: '2026-02-10', checkOutDate: '2026-02-12', checkInTime: '14:30', checkOutTime: '11:15', duration: '2 nights', totalCost: '$200' },
    { id: 2, guestName: 'Jane Smith', guestEmail: 'jane@example.com', guestPhone: '+1-555-0102', roomNo: 'Room 205', checkInDate: '2026-02-15', checkOutDate: '2026-02-18', checkInTime: '15:00', checkOutTime: '11:00', duration: '3 nights', totalCost: '$450' },
    { id: 3, guestName: 'Mike Johnson', guestEmail: 'mike@example.com', guestPhone: '+1-555-0103', roomNo: 'Room 101', checkInDate: '2026-03-01', checkOutDate: '2026-03-04', checkInTime: '16:45', checkOutTime: '10:30', duration: '3 nights', totalCost: '$300' },
    { id: 4, guestName: 'Sarah Williams', guestEmail: 'sarah@example.com', guestPhone: '+1-555-0104', roomNo: 'Room 301', checkInDate: '2026-03-05', checkOutDate: '2026-03-10', checkInTime: '14:00', checkOutTime: '12:00', duration: '5 nights', totalCost: '$1250' },
    { id: 5, guestName: 'Alex Brown', guestEmail: 'alex@example.com', guestPhone: '+1-555-0105', roomNo: 'Room 102', checkInDate: '2026-03-15', checkOutDate: '2026-03-17', checkInTime: '15:30', checkOutTime: '11:45', duration: '2 nights', totalCost: '$200' },
    { id: 6, guestName: 'John Doe', guestEmail: 'john@example.com', guestPhone: '+1-555-0101', roomNo: 'Room 205', checkInDate: '2026-03-20', checkOutDate: '2026-03-23', checkInTime: '14:15', checkOutTime: '10:00', duration: '3 nights', totalCost: '$450' },
  ]

  const rooms = ['all', 'Room 101', 'Room 102', 'Room 205', 'Room 301']

  const filteredHistory = bookingHistory.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRoom = filterRoom === 'all' || booking.roomNo === filterRoom
    return matchesSearch && matchesRoom
  })

  const calculateRevenue = () => {
    return filteredHistory.reduce((sum, booking) => {
      const cost = parseInt(booking.totalCost.replace('$', ''))
      return sum + cost
    }, 0)
  }

  return (
    <div className="booking-history">
      {/* Header */}
      <div className="history-header">
        <div className="header-content">
          <h1>📜 Booking History</h1>
          <p>View all past bookings and guest check-out records</p>
        </div>
      </div>

      {/* Stats */}
      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-label">📊 Total Check-outs</div>
          <div className="stat-value">{filteredHistory.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">💰 Total Revenue</div>
          <div className="stat-value">${calculateRevenue()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">📅 Average Stay</div>
          <div className="stat-value">
            {filteredHistory.length > 0
              ? (filteredHistory.reduce((sum, b) => sum + parseInt(b.duration), 0) / filteredHistory.length).toFixed(1)
              : 0} nights
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="history-main">
        {/* History Section */}
        <div className="history-section">
          <div className="section-header">
            <h2>🏨 Check-out Records ({filteredHistory.length})</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search by guest name or email..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
              >
                {rooms.map(room => (
                  <option key={room} value={room}>
                    {room === 'all' ? 'All Rooms' : room}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* History Table */}
          <div className="history-container">
            {filteredHistory.length === 0 ? (
              <div className="empty-state">
                <p>No booking history found.</p>
              </div>
            ) : (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Guest Information</th>
                      <th>Room</th>
                      <th>Check-in / Check-out</th>
                      <th>Duration</th>
                      <th>Times</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map(booking => (
                      <tr key={booking.id} className="history-row">
                        <td className="guest-info-cell">
                          <div className="guest-name">{booking.guestName}</div>
                          <div className="guest-details">
                            {booking.guestEmail}<br />
                            {booking.guestPhone}
                          </div>
                        </td>
                        <td className="room-cell">
                          <span className="room-badge">{booking.roomNo}</span>
                        </td>
                        <td className="dates-cell">
                          <div className="date-info">
                            📅 Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                          </div>
                          <div className="date-info">
                            ✔️ Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="duration-cell">
                          <span className="duration-badge">{booking.duration}</span>
                        </td>
                        <td className="times-cell">
                          <div className="time-info">🕐 In: {booking.checkInTime}</div>
                          <div className="time-info">🕐 Out: {booking.checkOutTime}</div>
                        </td>
                        <td className="revenue-cell">
                          <span className="revenue-badge">{booking.totalCost}</span>
                        </td>
                      </tr>
                    ))}
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
