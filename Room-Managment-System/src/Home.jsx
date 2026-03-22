import './Home.css'

export default function Home() {
  const rooms = [
    { id: 1, name: 'Single Room 101', capacity: 1, status: 'available', floor: '1st' },
    { id: 2, name: 'Single Room 102', capacity: 1, status: 'booked', floor: '1st' },
    { id: 3, name: 'Double Room 201', capacity: 2, status: 'available', floor: '2nd' },
    { id: 4, name: 'Double Room 202', capacity: 2, status: 'maintenance', floor: '2nd' },
    { id: 5, name: 'Suite 301', capacity: 3, status: 'booked', floor: '3rd' },
    { id: 6, name: 'Suite 302', capacity: 3, status: 'available', floor: '3rd' },
  ]

  const stats = [
    { icon: '🛏️', label: 'Total Rooms', value: rooms.length, color: '#4a5568' },
    { icon: '✅', label: 'Available', value: rooms.filter(r => r.status === 'available').length, color: '#10b981' },
    { icon: '📋', label: 'Booked', value: rooms.filter(r => r.status === 'booked').length, color: '#3b82f6' },
    { icon: '🔧', label: 'Maintenance', value: rooms.filter(r => r.status === 'maintenance').length, color: '#f59e0b' },
  ]

  const getStatusClass = (status) => {
    return `status status-${status}`
  }

  const getRoomIcon = (roomName) => {
    if (roomName.includes('Single')) return '🛏️'
    if (roomName.includes('Double')) return '🛏️🛏️'
    if (roomName.includes('Suite')) return '👑'
    return '🛏️'
  }

  return (
    <div className="home">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🏨 Hotel Room Booking System</h1>
            <p>Receptionist booking system for guests - Manage rooms efficiently</p>
          </div>
          <button className="btn btn-primary">+ Book Room</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        {/* Statistics Cards */}
        <section className="stats-section">
          <h2>📊 Overview</h2>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                  <span style={{ fontSize: '28px' }}>{stat.icon}</span>
                </div>
                <div className="stat-content">
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rooms Section */}
        <section className="rooms-section">
          <div className="section-header">
            <h2>Rooms</h2>
            <div className="filters">
              <input
                type="text"
                placeholder="Search rooms..."
                className="search-input"
              />
              <select className="filter-select">
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Rooms Table */}
          <div className="rooms-container">
            <div className="rooms-list">
              {rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-header">
                    <div>
                      <span style={{ fontSize: '24px', marginRight: '8px' }}>
                        {getRoomIcon(room.name)}
                      </span>
                      <h3 style={{ display: 'inline' }}>{room.name}</h3>
                    </div>
                    <span className={getStatusClass(room.status)}>
                      {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                    </span>
                  </div>
                  <div className="room-details">
                    <div className="detail-item">
                      <span className="detail-label">Capacity</span>
                      <span className="detail-value">{room.capacity} people</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Floor</span>
                      <span className="detail-value">{room.floor}</span>
                    </div>
                  </div>
                  <div className="room-actions">
                    <button className="btn btn-small btn-secondary">View</button>
                    <button className="btn btn-small btn-secondary">Book</button>
                    <button className="btn btn-small btn-secondary">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
