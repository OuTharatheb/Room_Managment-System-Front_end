import { useState } from 'react'
import './Reports.css'

export default function Reports() {
  const reports = [
    { id: 1, title: 'Occupancy Report', description: 'View daily and monthly occupancy rates', icon: '📊', color: '#4a5568' },
    { id: 2, title: 'Booking Trends', description: 'Track booking patterns and peak times', icon: '📈', color: '#3b82f6' },
    { id: 3, title: 'Revenue Report', description: 'Track total revenue and payment status', icon: '💰', color: '#10b981' },
    { id: 4, title: 'Guest Report', description: 'View guest check-ins and check-outs', icon: '👥', color: '#8b5cf6' },
  ]

  const stats = [
    { label: 'Total Bookings', value: '156', change: '+12%', color: '#3b82f6' },
    { label: 'Occupancy Rate', value: '72%', change: '+5%', color: '#10b981' },
    { label: 'Total Revenue', value: '$24,500', change: '+18%', color: '#4a5568' },
    { label: 'Avg Stay Days', value: '2.3', change: '+0.3%', color: '#8b5cf6' },
  ]

  const roomStats = [
    { name: 'Single Room 101', bookings: 34, occupancy: '85%', revenue: '$2,040' },
    { name: 'Single Room 102', bookings: 28, occupancy: '72%', revenue: '$1,680' },
    { name: 'Double Room 201', bookings: 42, occupancy: '88%', revenue: '$5,460' },
    { name: 'Double Room 202', bookings: 38, occupancy: '80%', revenue: '$4,940' },
    { name: 'Suite 301', bookings: 18, occupancy: '65%', revenue: '$8,100' },
  ]

  const [selectedReport, setSelectedReport] = useState(null)

  return (
    <div className="reports-management">
      {/* Header */}
      <div className="reports-header">
        <div className="header-content">
          <h1>📊 Hotel Reports</h1>
          <p>View occupancy and booking analytics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="reports-main">
        {/* Summary Stats */}
        <section className="stats-section">
          <h2>📈 Key Metrics</h2>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card-report">
                <div className="stat-header">
                  <h3>{stat.label}</h3>
                  <span className="stat-change positive">↑ {stat.change}</span>
                </div>
                <p className="stat-value-large" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Reports Grid */}
        <section className="reports-section">
          <h2>📑 Available Reports</h2>
          <div className="reports-grid">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="report-card"
                onClick={() => setSelectedReport(report)}
              >
                <div className="report-icon" style={{ color: report.color }}>
                  {report.icon}
                </div>
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <button className="btn btn-small btn-primary">View Report</button>
              </div>
            ))}
          </div>
        </section>

        {/* Room Statistics Table */}
        <section className="room-stats-section">
          <h2>🛏️ Room Performance</h2>
          <div className="table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Total Bookings</th>
                  <th>Occupancy Rate</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {roomStats.map((room) => (
                  <tr key={room.name}>
                    <td className="room-name">{room.name}</td>
                    <td>{room.bookings}</td>
                    <td>
                      <div className="occupancy-bar">
                        <div 
                          className="occupancy-fill"
                          style={{ width: room.occupancy }}
                        ></div>
                      </div>
                      <span className="occupancy-text">{room.occupancy}</span>
                    </td>
                    <td className="revenue-cell">{room.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Download Section */}
        <section className="download-section">
          <h2>📥 Export Data</h2>
          <div className="download-buttons">
            <button className="btn btn-secondary">📥 Download CSV</button>
            <button className="btn btn-secondary">📄 Download PDF</button>
            <button className="btn btn-secondary">📊 Download Excel</button>
          </div>
        </section>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedReport.title}</h2>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>{selectedReport.description}</p>
              <p style={{ marginTop: '20px', color: 'var(--text)' }}>
                This report contains valuable insights about your room management system performance.
              </p>
              <div style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedReport(null)}>Close</button>
                <button className="btn btn-primary">Generate Full Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
