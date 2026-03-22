import './Sidebar.css'

export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'bookings', label: 'Book Guest Room', icon: '📅' },
    { id: 'calendar', label: 'Room Calendar', icon: '🗓️' },
    { id: 'rooms', label: 'View Rooms', icon: '🏢' },
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'guests', label: 'Guests', icon: '👥' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">🏨</div>
        <h2>Receptionist Portal</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">R</div>
          <div className="user-info">
            <p className="user-name">Receptionist</p>
            <p className="user-role">Front Desk</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
