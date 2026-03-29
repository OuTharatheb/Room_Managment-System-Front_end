import './Sidebar.css'

export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'bookings', label: 'Book Guest Room' },
    { id: 'calendar', label: 'Room Calendar' },
    { id: 'rooms', label: 'View Rooms' },
    { id: 'home', label: 'Dashboard' },
    { id: 'guests', label: 'Guests' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
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
