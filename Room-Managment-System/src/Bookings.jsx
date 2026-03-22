import { useState } from 'react'
import './Bookings.css'

export default function Bookings() {
  const [bookings, setBookings] = useState([
    { id: 1, roomId: 1, roomName: 'Conference Room A', guestName: 'John Doe', email: 'john@example.com', date: '2026-03-25', startTime: '09:00', endTime: '11:00', status: 'confirmed', attendees: 8 },
    { id: 2, roomId: 2, roomName: 'Conference Room B', guestName: 'Jane Smith', email: 'jane@example.com', date: '2026-03-25', startTime: '14:00', endTime: '15:30', status: 'pending', attendees: 5 },
    { id: 3, roomId: 5, roomName: 'Board Room', guestName: 'Mike Johnson', email: 'mike@example.com', date: '2026-03-26', startTime: '10:00', endTime: '12:00', status: 'confirmed', attendees: 15 },
    { id: 4, roomId: 3, roomName: 'Meeting Room 101', guestName: 'Sarah Williams', email: 'sarah@example.com', date: '2026-03-26', startTime: '15:00', endTime: '16:00', status: 'cancelled', attendees: 4 },
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    roomId: '',
    roomName: '',
    guestName: '',
    email: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: '',
  })

  const rooms = [
    { id: 1, name: 'Conference Room A' },
    { id: 2, name: 'Conference Room B' },
    { id: 3, name: 'Meeting Room 101' },
    { id: 5, name: 'Board Room' },
    { id: 6, name: 'Training Room' },
  ]

  const openForm = (booking = null) => {
    if (booking) {
      setFormData({
        roomId: booking.roomId,
        roomName: booking.roomName,
        guestName: booking.guestName,
        email: booking.email,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        attendees: booking.attendees,
      })
      setSelectedBooking(booking)
    } else {
      setFormData({
        roomId: '',
        roomName: '',
        guestName: '',
        email: '',
        date: '',
        startTime: '',
        endTime: '',
        attendees: '',
      })
      setSelectedBooking(null)
    }
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedBooking(null)
    setFormData({
      roomId: '',
      roomName: '',
      guestName: '',
      email: '',
      date: '',
      startTime: '',
      endTime: '',
      attendees: '',
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoomChange = (e) => {
    const roomId = e.target.value
    const room = rooms.find(r => r.id.toString() === roomId)
    setFormData(prev => ({
      ...prev,
      roomId,
      roomName: room ? room.name : '',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedBooking) {
      setBookings(bookings.map(b =>
        b.id === selectedBooking.id
          ? { ...b, ...formData, status: 'pending' }
          : b
      ))
    } else {
      setBookings([...bookings, {
        ...formData,
        id: Date.now(),
        roomId: parseInt(formData.roomId),
        attendees: parseInt(formData.attendees),
        status: 'pending',
      }])
    }
    closeForm()
  }

  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map(b =>
      b.id === id ? { ...b, status: newStatus } : b
    ))
  }

  const deleteBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id))
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const matchesSearch = booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusClass = (status) => `status status-${status}`

  return (
    <div className="bookings-management">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-content">
          <h1>📅 Booking Management</h1>
          <p>View and manage all room bookings</p>
        </div>
        <button className="btn btn-primary" onClick={() => openForm()}>
          + New Booking
        </button>
      </div>

      {/* Main Content */}
      <div className="bookings-main">
        {/* Form Modal */}
        {isFormOpen && (
          <div className="modal-overlay" onClick={closeForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedBooking ? 'Edit Booking' : 'Create New Booking'}</h2>
                <button className="close-btn" onClick={closeForm}>&times;</button>
              </div>

              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label htmlFor="roomId">Room *</label>
                  <select
                    id="roomId"
                    name="roomId"
                    value={formData.roomId}
                    onChange={handleRoomChange}
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="guestName">Guest Name *</label>
                  <input
                    type="text"
                    id="guestName"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., john@example.com"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="attendees">Attendees *</label>
                    <input
                      type="number"
                      id="attendees"
                      name="attendees"
                      value={formData.attendees}
                      onChange={handleInputChange}
                      placeholder="e.g., 10"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time *</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endTime">End Time *</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedBooking ? 'Update Booking' : 'Create Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        <div className="bookings-section">
          <div className="section-header">
            <h2>📋 All Bookings ({filteredBookings.length})</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search by name, room, or email..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bookings-container">
            {filteredBookings.length === 0 ? (
              <div className="empty-state">
                <p>No bookings found. Create your first booking to get started.</p>
              </div>
            ) : (
              <div className="bookings-table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Guest Name</th>
                      <th>Room</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Attendees</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} className="booking-row">
                        <td className="guest-cell">
                          <div className="guest-info">
                            <div className="guest-name">{booking.guestName}</div>
                            <div className="guest-email">{booking.email}</div>
                          </div>
                        </td>
                        <td>{booking.roomName}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>{`${booking.startTime} - ${booking.endTime}`}</td>
                        <td className="attendees-cell">
                          <span className="attendees-badge">{booking.attendees}</span>
                        </td>
                        <td>
                          <select
                            className={getStatusClass(booking.status)}
                            value={booking.status}
                            onChange={(e) => updateStatus(booking.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div className="booking-actions">
                            <button
                              className="btn-icon btn-edit"
                              onClick={() => openForm(booking)}
                              title="Edit booking"
                            >
                              ✎
                            </button>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => deleteBooking(booking.id)}
                              title="Delete booking"
                            >
                              ✕
                            </button>
                          </div>
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
