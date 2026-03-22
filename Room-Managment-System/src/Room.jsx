import { useEffect, useMemo, useState } from 'react'
import './Room.css'

export default function Room() {
  const initialRooms = [
    { id: 1, name: 'Single Room 101', capacity: 1, status: 'available', floor: '1st', amenities: ['WiFi', 'AC', 'TV'] },
    { id: 2, name: 'Single Room 102', capacity: 1, status: 'available', floor: '1st', amenities: ['WiFi', 'AC', 'TV'] },
    { id: 3, name: 'Double Room 201', capacity: 2, status: 'available', floor: '2nd', amenities: ['WiFi', 'AC', 'TV', 'Minibar'] },
    { id: 4, name: 'Double Room 202', capacity: 2, status: 'available', floor: '2nd', amenities: ['WiFi', 'AC', 'TV'] },
    { id: 5, name: 'Suite 301', capacity: 3, status: 'available', floor: '3rd', amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Workspace'] },
    { id: 6, name: 'Suite 302', capacity: 3, status: 'available', floor: '3rd', amenities: ['WiFi', 'AC', 'TV', 'Minibar', 'Safe'] },
  ]

  const [internalRooms, setInternalRooms] = useState(initialRooms)
  const [bookingsVersion, setBookingsVersion] = useState(0)

  useEffect(() => {
    const onBookingsUpdated = () => setBookingsVersion(v => v + 1)
    window.addEventListener('bookings-updated', onBookingsUpdated)
    window.addEventListener('storage', onBookingsUpdated)
    return () => {
      window.removeEventListener('bookings-updated', onBookingsUpdated)
      window.removeEventListener('storage', onBookingsUpdated)
    }
  }, [])

  const displayRooms = useMemo(() => {
    void bookingsVersion
    const activeBookings = JSON.parse(localStorage.getItem('activeBookings') || '[]')

    return internalRooms.map(room => {
      if (room.status === 'maintenance') {
        return room
      }

      const bookingForRoom = activeBookings.find(booking => booking.roomNo === room.name)
      if (!bookingForRoom) {
        return { ...room, status: 'available' }
      }

      return {
        ...room,
        status: bookingForRoom.status === 'checked-in' ? 'checked-in' : 'booked',
      }
    })
  }, [internalRooms, bookingsVersion])

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    floor: '',
    amenities: [],
  })

  const openForm = (room = null) => {
    if (room) {
      setFormData({
        name: room.name,
        capacity: room.capacity,
        floor: room.floor,
        amenities: room.amenities,
      })
      setSelectedRoom(room)
    } else {
      setFormData({ name: '', capacity: '', floor: '', amenities: [] })
      setSelectedRoom(null)
    }
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedRoom(null)
    setFormData({ name: '', capacity: '', floor: '', amenities: [] })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAmentiesChange = (e) => {
    const { value, checked } = e.target
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, value]
        : prev.amenities.filter(a => a !== value)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedRoom) {
      setInternalRooms(internalRooms.map(r =>
        r.id === selectedRoom.id 
          ? { ...r, ...formData }
          : r
      ))
    } else {
      setInternalRooms([...internalRooms, { ...formData, id: Date.now(), status: 'available' }])
    }
    closeForm()
  }

  const deleteRoom = (id) => {
    setInternalRooms(internalRooms.filter(r => r.id !== id))
    setSelectedRoom(null)
  }

  const updateStatus = (id, newStatus) => {
    setInternalRooms(internalRooms.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    ))
  }

  const amenitiesOptions = ['WiFi', 'AC', 'TV', 'Minibar', 'Safe', 'Workspace', 'Bathtub', 'Wake-up Call']

  return (
    <div className="room-management">
      {/* Header */}
      <div className="room-header">
        <div className="header-content">
          <h1>🛏️ Guest Room Management</h1>
          <p>Manage guest rooms and availability</p>
        </div>
        <button className="btn btn-primary" onClick={() => openForm()}>
          + Add Room
        </button>
      </div>

      {/* Main Content */}
      <div className="room-main">
        {/* Form Modal */}
        {isFormOpen && (
          <div className="modal-overlay" onClick={closeForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedRoom ? 'Edit Room' : 'Add New Room'}</h2>
                <button className="close-btn" onClick={closeForm}>&times;</button>
              </div>

              <form onSubmit={handleSubmit} className="room-form">
                <div className="form-group">
                  <label htmlFor="name">Room Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Conference Room A"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="capacity">Capacity *</label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 20"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="floor">Floor *</label>
                    <input
                      type="text"
                      id="floor"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      placeholder="e.g., 1st, 2nd, 3rd"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Amenities</label>
                  <div className="amenities-grid">
                    {amenitiesOptions.map(amenity => (
                      <div key={amenity} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={amenity}
                          value={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={handleAmentiesChange}
                        />
                        <label htmlFor={amenity}>{amenity}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedRoom ? 'Update Room' : 'Add Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rooms Detail View */}
          <div className="rooms-detail-section">
            <h2>📋 All Rooms ({displayRooms.length})</h2>
          
          <div className="rooms-detail-list">
             {displayRooms.length === 0 ? (
              <div className="empty-state">
                <p>No rooms found. Create your first room to get started.</p>
              </div>
            ) : (
               displayRooms.map(room => (
                <div key={room.id} className="room-detail-card">
                  <div className="room-detail-header">
                    <div className="room-title">
                      <h3>{room.name}</h3>
                      <span className={`status status-${room.status}`}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </span>
                    </div>
                    <div className="room-id">ID: {room.id}</div>
                  </div>

                  <div className="room-detail-body">
                    <div className="detail-row">
                      <div className="detail-col">
                        <span className="detail-label">Capacity</span>
                        <span className="detail-value">{room.capacity} people</span>
                      </div>
                      <div className="detail-col">
                        <span className="detail-label">Floor</span>
                        <span className="detail-value">{room.floor}</span>
                      </div>
                    </div>

                    {room.amenities && room.amenities.length > 0 && (
                      <div className="amenities-section">
                        <span className="detail-label">Amenities</span>
                        <div className="amenities-list">
                          {room.amenities.map(amenity => (
                            <span key={amenity} className="amenity-tag">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="room-detail-footer">
                    <div className="status-controls">
                      <label>Status:</label>
                      <select 
                        value={room.status}
                        onChange={(e) => updateStatus(room.id, e.target.value)}
                        className="status-select"
                        disabled={room.status === 'booked' || room.status === 'checked-in'}
                      >
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                        <option value="checked-in">Checked In</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                      {(room.status === 'booked' || room.status === 'checked-in') && (
                        <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                          (Auto-updated by bookings)
                        </span>
                      )}
                    </div>

                    <div className="room-actions">
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => openForm(room)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => deleteRoom(room.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
