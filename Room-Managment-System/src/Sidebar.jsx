import './Sidebar.css'

export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: '📊' },
    { id: 'rooms', label: 'Rooms', icon: '🏢' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'users', label: 'Staff', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">🏛️</div>
        <h2>RMS</h2>
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
          <div className="user-avatar">A</div>
          <div className="user-info">
            <p className="user-name">Admin</p>
            <p className="user-role">Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
