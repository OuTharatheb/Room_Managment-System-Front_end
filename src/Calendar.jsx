import { useEffect, useMemo, useState } from 'react'
import './Calendar.css'
const formatCurrency = (amount) => `$${amount}`

const roomRates = {
  'Single Room 101': 100,
  'Single Room 102': 100,
  'Double Room 201': 180,
  'Double Room 202': 180,
  'Suite 301': 250,
  'Suite 302': 250,
}

const allRooms = Object.keys(roomRates)

const getRoomRate = (roomName) => roomRates[roomName] ?? 0

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isDateInBookingRange = (day, booking) => {
  const current = formatDateKey(day)
  return current >= booking.checkInDate && current < booking.checkOutDate
}

const getMonthGridDates = (displayDate) => {
  const year = displayDate.getFullYear()
  const month = displayDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const startOffset = firstDayOfMonth.getDay()

  const startDate = new Date(year, month, 1 - startOffset)
  const cells = []

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    cells.push(date)
  }

  return cells
}

export default function Calendar() {
  const [displayDate, setDisplayDate] = useState(new Date())
  const [selectedDateKey, setSelectedDateKey] = useState(formatDateKey(new Date()))
  const [activeBookings, setActiveBookings] = useState(() => JSON.parse(localStorage.getItem('activeBookings') || '[]'))
  const [checkoutTarget, setCheckoutTarget] = useState(null)

  useEffect(() => {
    const syncBookings = () => {
      setActiveBookings(JSON.parse(localStorage.getItem('activeBookings') || '[]'))
    }

    window.addEventListener('bookings-updated', syncBookings)
    window.addEventListener('storage', syncBookings)

    return () => {
      window.removeEventListener('bookings-updated', syncBookings)
      window.removeEventListener('storage', syncBookings)
    }
  }, [])

  const monthGrid = useMemo(() => getMonthGridDates(displayDate), [displayDate])

  const selectedDateBookings = useMemo(() => {
    return activeBookings.filter((booking) => {
      return selectedDateKey >= booking.checkInDate && selectedDateKey < booking.checkOutDate
    })
  }, [activeBookings, selectedDateKey])

  const availableRooms = useMemo(() => {
    const occupied = new Set(selectedDateBookings.map(booking => booking.roomNo))
    return allRooms.filter(roomName => !occupied.has(roomName))
  }, [selectedDateBookings])

  const canCheckIn = (booking) => {
    return booking.status === 'confirmed' && selectedDateKey >= booking.checkInDate
  }

  const canCheckOut = (booking) => {
    return booking.status === 'checked-in'
  }

  const handleCheckIn = (bookingId) => {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const updatedBookings = activeBookings.map((booking) => {
      if (booking.id !== bookingId) return booking
      return { ...booking, status: 'checked-in', checkInTime: timeStr }
    })

    setActiveBookings(updatedBookings)
    localStorage.setItem('activeBookings', JSON.stringify(updatedBookings))
    window.dispatchEvent(new CustomEvent('bookings-updated'))
  }

  const handleEditBooking = (bookingId) => {
    localStorage.setItem('pendingBookingEditId', String(bookingId))
    window.dispatchEvent(new CustomEvent('navigate-page', { detail: { page: 'bookings' } }))
  }

  const performCheckOut = (booking) => {
    if (!booking) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const checkInDate = new Date(booking.checkInDate)
    const checkOutDate = new Date(booking.checkOutDate)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    const rate = getRoomRate(booking.roomNo)
    const totalCost = formatCurrency(nights * rate)

    const updatedActiveBookings = activeBookings.filter(item => item.id !== booking.id)
    const currentHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
    const updatedHistory = [
      ...currentHistory,
      {
        ...booking,
        status: 'checked-out',
        checkOutTime: timeStr,
        totalCost,
      },
    ]

    setActiveBookings(updatedActiveBookings)
    localStorage.setItem('activeBookings', JSON.stringify(updatedActiveBookings))
    localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory))
    window.dispatchEvent(new CustomEvent('bookings-updated'))
    setCheckoutTarget(null)
  }

  const handleCheckOut = (bookingId) => {
    const booking = activeBookings.find(item => item.id === bookingId)
    if (!booking) return
    setCheckoutTarget(booking)
  }

  const closeCheckoutModal = () => {
    setCheckoutTarget(null)
  }

  const goToPreviousMonth = () => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setDisplayDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDateKey(formatDateKey(today))
  }

  const getDayStatus = (day) => {
    const dateKey = formatDateKey(day)

    const hasCheckIn = activeBookings.some(booking => booking.checkInDate === dateKey)
    const hasCheckOut = activeBookings.some(booking => booking.checkOutDate === dateKey)
    const hasStay = activeBookings.some(booking => isDateInBookingRange(day, booking))

    if (hasCheckIn) return 'checkin'
    if (hasCheckOut) return 'checkout'
    if (hasStay) return 'occupied'
    return 'available'
  }

  return (
    <div className="calendar-management">
      <header className="calendar-header">
        <div>
          <h1>Booking Calendar</h1>
        </div>
        <div className="calendar-actions">
          <button className="btn-calendar" onClick={goToToday}>Today</button>
        </div>
      </header>

      <section className="calendar-layout">
        <article className="calendar-panel">
          <div className="calendar-toolbar">
            <button className="month-nav" onClick={goToPreviousMonth} aria-label="Previous month">&lt;</button>
            <h2>
              {displayDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <button className="month-nav" onClick={goToNextMonth} aria-label="Next month">&gt;</button>
          </div>

          <div className="calendar-weekdays">
            {dayNames.map(name => (
              <div key={name}>{name}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {monthGrid.map((day) => {
              const dateKey = formatDateKey(day)
              const isCurrentMonth = day.getMonth() === displayDate.getMonth()
              const status = getDayStatus(day)
              const isSelected = selectedDateKey === dateKey

              return (
                <button
                  key={dateKey}
                  className={`day-cell ${isCurrentMonth ? '' : 'muted'} ${status} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDateKey(dateKey)}
                >
                  <span>{day.getDate()}</span>
                </button>
              )
            })}
          </div>

          <div className="calendar-legend">
            <div><span className="dot dot-checkin" /> Check-in</div>
            <div><span className="dot dot-occupied" /> Occupied</div>
            <div><span className="dot dot-checkout" /> Check-out</div>
            <div><span className="dot dot-available" /> Available</div>
          </div>
        </article>

        <aside className="availability-panel">
          <h3>Availability on {new Date(selectedDateKey).toLocaleDateString()}</h3>
          <p className="panel-subtitle">
            {availableRooms.length} of {allRooms.length} rooms available
          </p>

          <div className="availability-section">
            <h4>Checked-in / Reserved</h4>
            {selectedDateBookings.length === 0 ? (
              <p className="empty">No active bookings on this date.</p>
            ) : (
              <ul>
                {selectedDateBookings.map(booking => (
                  <li key={booking.id}>
                    <div>
                      <strong>{booking.roomNo}</strong>
                      <span>{booking.guestName}</span>
                    </div>
                    <div className="booking-quick-actions">
                      <small>{booking.status === 'checked-in' ? 'Checked In' : 'Confirmed'}</small>
                      {canCheckIn(booking) && (
                        <button className="inline-action action-checkin" onClick={() => handleCheckIn(booking.id)}>
                          Check-In
                        </button>
                      )}
                      {canCheckOut(booking) && (
                        <button className="inline-action action-checkout" onClick={() => handleCheckOut(booking.id)}>
                          Check-Out
                        </button>
                      )}
                      <button className="inline-action action-edit" onClick={() => handleEditBooking(booking.id)}>
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="availability-section">
            <h4>Available Rooms</h4>
            {availableRooms.length === 0 ? (
              <p className="empty">No room available.</p>
            ) : (
              <ul>
                {availableRooms.map(roomName => (
                  <li key={roomName} className="available-room">{roomName}</li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </section>

      {checkoutTarget && (
        <div className="calendar-modal-overlay" onClick={closeCheckoutModal}>
          <div className="calendar-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Confirm Check-Out</h3>
            <p>
              Check out <strong>{checkoutTarget.guestName}</strong> from{' '}
              <strong>{checkoutTarget.roomNo}</strong>?
            </p>
            <div className="calendar-modal-actions">
              <button className="inline-action modal-cancel" onClick={closeCheckoutModal}>
                Cancel
              </button>
              <button className="inline-action action-checkout" onClick={() => performCheckOut(checkoutTarget)}>
                Confirm Check-Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
