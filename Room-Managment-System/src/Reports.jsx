import { useState } from 'react'
import './Reports.css'

export default function Reports() {
  const reports = [
    { id: 1, title: 'Room Utilization Report', description: 'View average room occupancy rates', icon: '📊', color: '#aa3bff' },
    { id: 2, title: 'Booking Analytics', description: 'Monthly and yearly booking trends', icon: '📈', color: '#06b6d4' },
    { id: 3, title: 'Revenue Report', description: 'Track booking revenue and payments', icon: '💰', color: '#10b981' },
    { id: 4, title: 'Room Status Report', description: 'Maintenance schedules and room status', icon: '🔧', color: '#f59e0b' },
  ]

  const stats = [
    { label: 'Total Bookings', value: '156', change: '+12%', color: '#06b6d4' },
    { label: 'Room Occupancy', value: '72%', change: '+5%', color: '#10b981' },
    { label: 'Revenue', value: '$24,500', change: '+18%', color: '#aa3bff' },
    { label: 'Average Rating', value: '4.8/5', change: '+0.3%', color: '#f59e0b' },
  ]

  const roomStats = [
    { name: 'Conference Room A', bookings: 34, occupancy: '85%', revenue: '$3,400' },
    { name: 'Conference Room B', bookings: 28, occupancy: '72%', revenue: '$2,800' },
    { name: 'Meeting Room 101', bookings: 22, occupancy: '68%', revenue: '$1,650' },
    { name: 'Board Room', bookings: 18, occupancy: '65%', revenue: '$5,400' },
    { name: 'Training Room', bookings: 54, occupancy: '89%', revenue: '$8,100' },
  ]

  const [selectedReport, setSelectedReport] = useState(null)

  return (
    <div className="reports-management">
      {/* Header */}
      <div className="reports-header">
        <div className="header-content">
          <h1>📊 Reports & Analytics</h1>
          <p>Track performance and generate insights</p>
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
          <h2>🏢 Room Performance</h2>
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
