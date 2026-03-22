import { useState } from 'react'
import './Users.css'

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Manager', status: 'active', department: 'Administration' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Staff', status: 'active', department: 'Reception' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Admin', status: 'active', department: 'IT' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'Staff', status: 'inactive', department: 'Maintenance' },
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Staff',
    department: '',
    status: 'active',
  })

  const roles = ['Admin', 'Manager', 'Staff', 'Receptionist']
  const departments = ['Administration', 'Reception', 'IT', 'Maintenance', 'Facilities']

  const openForm = (user = null) => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
      })
      setSelectedUser(user)
    } else {
      setFormData({ name: '', email: '', role: 'Staff', department: '', status: 'active' })
      setSelectedUser(null)
    }
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedUser(null)
    setFormData({ name: '', email: '', role: 'Staff', department: '', status: 'active' })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u))
    } else {
      setUsers([...users, { ...formData, id: Date.now() }])
    }
    closeForm()
  }

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const getStatusClass = (status) => `status status-${status}`

  return (
    <div className="users-management">
      {/* Header */}
      <div className="users-header">
        <div className="header-content">
          <h1>👥 Staff Management</h1>
          <p>Manage team members and access control</p>
        </div>
        <button className="btn btn-primary" onClick={() => openForm()}>
          + Add Staff Member
        </button>
      </div>

      {/* Main Content */}
      <div className="users-main">
        {/* Form Modal */}
        {isFormOpen && (
          <div className="modal-overlay" onClick={closeForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedUser ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                <button className="close-btn" onClick={closeForm}>&times;</button>
              </div>

              <form onSubmit={handleSubmit} className="user-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
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
                    <label htmlFor="role">Role *</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="department">Department *</label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedUser ? 'Update Staff' : 'Add Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Section */}
        <div className="users-section">
          <div className="section-header">
            <h2>👥 Team Members ({users.length})</h2>
          </div>

          {users.length === 0 ? (
            <div className="empty-state">
              <p>No staff members found. Add your first staff member to get started.</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-header">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <div className="user-header-info">
                      <h3>{user.name}</h3>
                      <p className="user-role">{user.role}</p>
                    </div>
                    <span className={getStatusClass(user.status)}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>

                  <div className="user-body">
                    <div className="user-detail">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="user-detail">
                      <span className="detail-label">Department</span>
                      <span className="detail-value">{user.department}</span>
                    </div>
                  </div>

                  <div className="user-actions">
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={() => openForm(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
