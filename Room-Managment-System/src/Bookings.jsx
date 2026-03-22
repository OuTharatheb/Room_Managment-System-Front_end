import { useState, useEffect } from 'react'
import './Bookings.css'

export default function Bookings() {
  const [activeBookings, setActiveBookings] = useState(() => {
    const saved = localStorage.getItem('activeBookings')
    return saved ? JSON.parse(saved) : [
      { id: 1, roomNo: 'Double Room 201', guestName: 'John Doe', email: 'john@example.com', phone: '+1-555-0101', checkInDate: '2026-03-25', checkOutDate: '2026-03-27', guests: 2, status: 'confirmed', checkInTime: null, checkOutTime: null },
      { id: 2, roomNo: 'Suite 301', guestName: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0102', checkInDate: '2026-03-25', checkOutDate: '2026-03-26', guests: 3, status: 'pending', checkInTime: null, checkOutTime: null },
      { id: 3, roomNo: 'Single Room 101', guestName: 'Mike Johnson', email: 'mike@example.com', phone: '+1-555-0103', checkInDate: '2026-03-26', checkOutDate: '2026-03-28', guests: 1, status: 'checked-in', checkInTime: '14:30', checkOutTime: null },
    ]
  })

  const [bookingHistory, setBookingHistory] = useState(() => {
    const saved = localStorage.getItem('bookingHistory')
    return saved ? JSON.parse(saved) : [
      { id: 4, roomNo: 'Double Room 202', guestName: 'Sarah Williams', email: 'sarah@example.com', phone: '+1-555-0104', checkInDate: '2026-03-20', checkOutDate: '2026-03-21', guests: 2, status: 'checked-out', checkInTime: '15:00', checkOutTime: '10:30', totalCost: '$280' },
      { id: 5, roomNo: 'Suite 301', guestName: 'Alex Brown', email: 'alex@example.com', phone: '+1-555-0105', checkInDate: '2026-03-18', checkOutDate: '2026-03-19', guests: 2, status: 'checked-out', checkInTime: '16:00', checkOutTime: '11:00', totalCost: '$350' },
    ]
  })

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [formData, setFormData] = useState({
    roomNo: '',
    guestName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    guests: '',
  })

  // Save bookings to localStorage
  useEffect(() => {
    localStorage.setItem('activeBookings', JSON.stringify(activeBookings))
    window.dispatchEvent(new CustomEvent('bookings-updated'))
  }, [activeBookings])

  useEffect(() => {
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory))
    window.dispatchEvent(new CustomEvent('bookings-updated'))
  }, [bookingHistory])

  const rooms = [
    { id: 1, name: 'Single Room 101', rate: 100 },
    { id: 2, name: 'Single Room 102', rate: 100 },
    { id: 3, name: 'Double Room 201', rate: 150 },
    { id: 4, name: 'Double Room 202', rate: 150 },
    { id: 5, name: 'Suite 301', rate: 250 },
    { id: 6, name: 'Suite 302', rate: 250 },
  ]

  const openForm = (booking = null) => {
    if (booking) {
      setFormData({
        roomNo: booking.roomNo,
        guestName: booking.guestName,
        email: booking.email,
        phone: booking.phone,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        guests: booking.guests,
      })
      setSelectedBooking(booking)
    } else {
      setFormData({
        roomNo: '',
        guestName: '',
        email: '',
        phone: '',
        checkInDate: '',
        checkOutDate: '',
        guests: '',
      })
      setSelectedBooking(null)
    }
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedBooking(null)
    setFormData({
      roomNo: '',
      guestName: '',
      email: '',
      phone: '',
      checkInDate: '',
      checkOutDate: '',
      guests: '',
    })
  }

  useEffect(() => {
    const pendingIdRaw = localStorage.getItem('pendingBookingEditId')
    if (!pendingIdRaw) return

    const pendingId = Number(pendingIdRaw)
    if (!Number.isFinite(pendingId)) {
      localStorage.removeItem('pendingBookingEditId')
      return
    }

    const bookingToEdit = activeBookings.find(booking => booking.id === pendingId)
    if (bookingToEdit) {
      const timer = setTimeout(() => {
        openForm(bookingToEdit)
      }, 0)
      localStorage.removeItem('pendingBookingEditId')
      return () => clearTimeout(timer)
    }

    localStorage.removeItem('pendingBookingEditId')
  }, [activeBookings])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const isRoomAvailable = (roomName, checkInDate, checkOutDate, excludeBookingId = null) => {
    const newCheckIn = new Date(checkInDate)
    const newCheckOut = new Date(checkOutDate)

    // Check against active bookings
    for (let booking of activeBookings) {
      if (booking.id === excludeBookingId) continue
      if (booking.roomNo !== roomName) continue

      const existingCheckIn = new Date(booking.checkInDate)
      const existingCheckOut = new Date(booking.checkOutDate)

      // Check for overlapping dates
      if (newCheckIn < existingCheckOut && newCheckOut > existingCheckIn) {
        return false
      }
    }

    // Check against booking history
    for (let booking of bookingHistory) {
      if (booking.roomNo !== roomName) continue

      const existingCheckIn = new Date(booking.checkInDate)
      const existingCheckOut = new Date(booking.checkOutDate)

      // Check for overlapping dates
      if (newCheckIn < existingCheckOut && newCheckOut > existingCheckIn) {
        return false
      }
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.roomNo || !formData.guestName || !formData.email || !formData.checkInDate || !formData.checkOutDate) {
      alert('Please fill all required fields')
      return
    }

    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      alert('Check-out date must be after check-in date')
      return
    }

    // Check room availability
    if (!isRoomAvailable(formData.roomNo, formData.checkInDate, formData.checkOutDate, selectedBooking?.id)) {
      alert(`❌ Sorry, ${formData.roomNo} is already booked for those dates. Please select different dates or another room.`)
      return
    }

    if (selectedBooking) {
      setActiveBookings(activeBookings.map(b =>
        b.id === selectedBooking.id
          ? { ...b, ...formData, status: 'confirmed' }
          : b
      ))
    } else {
      setActiveBookings([...activeBookings, {
        ...formData,
        id: Date.now(),
        status: 'confirmed',
        checkInTime: null,
        checkOutTime: null,
      }])
    }
    closeForm()
  }

  const getAvailableRooms = () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      return rooms
    }
    return rooms.filter(room => isRoomAvailable(room.name, formData.checkInDate, formData.checkOutDate, selectedBooking?.id))
  }

  const checkInGuest = (id) => {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    setActiveBookings(activeBookings.map(b =>
      b.id === id ? { ...b, status: 'checked-in', checkInTime: timeStr } : b
    ))
  }

  const checkOutGuest = (id) => {
    const booking = activeBookings.find(b => b.id === id)
    if (!booking) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    const checkInDate = new Date(booking.checkInDate)
    const checkOutDate = new Date(booking.checkOutDate)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    const room = rooms.find(r => r.name === booking.roomNo)
    const totalCost = room ? `$${nights * room.rate}` : '$0'

    setActiveBookings(activeBookings.filter(b => b.id !== id))
    setBookingHistory([...bookingHistory, {
      ...booking,
      status: 'checked-out',
      checkOutTime: timeStr,
      totalCost
    }])
  }

  const deleteBooking = (id) => {
    setActiveBookings(activeBookings.filter(b => b.id !== id))
  }

  return (
    <div className="bookings-management">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-content">
          <h1>Guest Reservations</h1>
          <p>View and manage guest room bookings and check-ins</p>
        </div>
        <button className="btn btn-primary" onClick={() => openForm()}>
          + Book Room
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
                  <label htmlFor="roomNo">Room * 
                    {formData.checkInDate && formData.checkOutDate && (
                      <span style={{ fontSize: '12px', marginLeft: '8px' }}>
                        ({getAvailableRooms().length} available)
                      </span>
                    )}
                  </label>
                  <select
                    id="roomNo"
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.map(room => {
                      const isAvailable = !formData.checkInDate || !formData.checkOutDate || 
                        isRoomAvailable(room.name, formData.checkInDate, formData.checkOutDate, selectedBooking?.id)
                      return (
                        <option key={room.id} value={room.name} disabled={!isAvailable && formData.checkInDate && formData.checkOutDate}>
                          {room.name} (${room.rate}/night) {!isAvailable && formData.checkInDate && formData.checkOutDate ? '❌ Booked' : '✅ Available'}
                        </option>
                      )
                    })}
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

                <div className="form-row">
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
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., +1-555-0101"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkInDate">Check-In Date *</label>
                    <input
                      type="date"
                      id="checkInDate"
                      name="checkInDate"
                      value={formData.checkInDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkOutDate">Check-Out Date *</label>
                    <input
                      type="date"
                      id="checkOutDate"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Number of Guests *</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    min="1"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedBooking ? 'Update Booking' : 'Book Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Active Bookings Section */}
        <div className="bookings-section">
          <div className="section-header">
            <h2>📋 Active Bookings ({activeBookings.length})</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search guest name or room..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bookings-container">
            {activeBookings.length === 0 ? (
              <div className="empty-state">
                <p>No active bookings. Create a new booking to get started.</p>
              </div>
            ) : (
              <div className="bookings-table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Guests</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBookings.filter(booking =>
                      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      booking.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(booking => (
                      <tr key={booking.id} className="booking-row">
                        <td className="guest-cell">
                          <div className="guest-info">
                            <div className="guest-name">{booking.guestName}</div>
                            <div className="guest-email">{booking.email}</div>
                          </div>
                        </td>
                        <td>{booking.roomNo}</td>
                        <td>
                          <div className="date-info">
                            <div>{new Date(booking.checkInDate).toLocaleDateString()}</div>
                            {booking.checkInTime && <div className="time-info">✓ {booking.checkInTime}</div>}
                          </div>
                        </td>
                        <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                        <td className="guests-cell">
                          <span className="badge">{booking.guests}</span>
                        </td>
                        <td>
                          <span className={`status status-${booking.status}`}>
                            {booking.status === 'checked-in' ? '✓ Checked In' : '⏳ Confirmed'}
                          </span>
                        </td>
                        <td>
                          <div className="booking-actions">
                            {booking.status === 'confirmed' && (
                              <button
                                className="btn btn-small btn-success"
                                onClick={() => checkInGuest(booking.id)}
                                title="Check-in guest"
                              >
                                Check-In
                              </button>
                            )}
                            {booking.status === 'checked-in' && (
                              <button
                                className="btn btn-small btn-warning"
                                onClick={() => checkOutGuest(booking.id)}
                                title="Check-out guest"
                              >
                                Check-Out
                              </button>
                            )}
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

        {/* Booking History Section */}
        <div className="bookings-section">
          <div className="section-header">
            <h2>📜 Booking History</h2>
            <button
              className="btn btn-secondary"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? '▼ Hide' : '▶ Show'} ({bookingHistory.length})
            </button>
          </div>

          {showHistory && (
            <div className="bookings-container">
              {bookingHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No booking history yet.</p>
                </div>
              ) : (
                <div className="bookings-table-wrapper">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>Guest</th>
                        <th>Room</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Duration</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingHistory.map(booking => {
                        const nights = Math.ceil(
                          (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)
                        )
                        return (
                          <tr key={booking.id} className="booking-row history-row">
                            <td className="guest-cell">
                              <div className="guest-info">
                                <div className="guest-name">{booking.guestName}</div>
                                <div className="guest-email">{booking.email}</div>
                              </div>
                            </td>
                            <td>{booking.roomNo}</td>
                            <td>
                              <div className="date-info">
                                <div>{new Date(booking.checkInDate).toLocaleDateString()}</div>
                                <div className="time-info">{booking.checkInTime}</div>
                              </div>
                            </td>
                            <td>
                              <div className="date-info">
                                <div>{new Date(booking.checkOutDate).toLocaleDateString()}</div>
                                <div className="time-info">{booking.checkOutTime}</div>
                              </div>
                            </td>
                            <td className="duration-cell">
                              {nights} {nights === 1 ? 'night' : 'nights'}
                            </td>
                            <td className="total-cell">{booking.totalCost}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
