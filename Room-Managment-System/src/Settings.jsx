import { useState } from 'react'
import './Settings.css'

export default function Settings() {
  const [settings, setSettings] = useState({
    businessName: 'Room Management System',
    businessEmail: 'contact@roomms.com',
    businessPhone: '+1 (555) 000-0000',
    timezone: 'UTC',
    language: 'English',
    currency: 'USD',
    darkMode: false,
    emailNotifications: true,
    smsNotifications: false,
    autoConfirmBookings: false,
    maxBookingAdvance: 30,
    minBookingDuration: 30,
    cancellationBuffer: 24,
  })

  const [activeTab, setActiveTab] = useState('general')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="settings-management">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <h1>⚙️ Settings</h1>
          <p>Configure your room management system</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="settings-main">
        {/* Success Message */}
        {saveSuccess && (
          <div className="success-message">
            ✓ Settings saved successfully!
          </div>
        )}

        {/* Tabs */}
        <div className="settings-tabs">
          <button
            className={`tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`tab ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            Booking
          </button>
          <button
            className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`tab ${activeTab === 'display' ? 'active' : ''}`}
            onClick={() => setActiveTab('display')}
          >
            Display
          </button>
        </div>

        {/* Settings Sections */}
        <div className="settings-content">
          {/* General Tab */}
          {activeTab === 'general' && (
            <section className="settings-section">
              <h2>General Settings</h2>
              
              <div className="settings-panel">
                <div className="setting-group">
                  <label htmlFor="businessName">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={settings.businessName}
                    onChange={handleChange}
                    className="setting-input"
                  />
                  <small>The name of your organization</small>
                </div>

                <div className="setting-group">
                  <label htmlFor="businessEmail">Business Email</label>
                  <input
                    type="email"
                    id="businessEmail"
                    name="businessEmail"
                    value={settings.businessEmail}
                    onChange={handleChange}
                    className="setting-input"
                  />
                  <small>Contact email for the system</small>
                </div>

                <div className="setting-group">
                  <label htmlFor="businessPhone">Business Phone</label>
                  <input
                    type="tel"
                    id="businessPhone"
                    name="businessPhone"
                    value={settings.businessPhone}
                    onChange={handleChange}
                    className="setting-input"
                  />
                  <small>Contact phone number</small>
                </div>

                <div className="settings-row">
                  <div className="setting-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={settings.timezone}
                      onChange={handleChange}
                      className="setting-select"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Standard Time</option>
                      <option value="CST">Central Standard Time</option>
                      <option value="MST">Mountain Standard Time</option>
                      <option value="PST">Pacific Standard Time</option>
                    </select>
                  </div>

                  <div className="setting-group">
                    <label htmlFor="currency">Currency</label>
                    <select
                      id="currency"
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className="setting-select"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <section className="settings-section">
              <h2>Booking Settings</h2>
              
              <div className="settings-panel">
                <div className="setting-group">
                  <label htmlFor="autoConfirmBookings">
                    <input
                      type="checkbox"
                      id="autoConfirmBookings"
                      name="autoConfirmBookings"
                      checked={settings.autoConfirmBookings}
                      onChange={handleChange}
                      className="setting-checkbox"
                    />
                    Auto-confirm Bookings
                  </label>
                  <small>Automatically confirm new bookings without review</small>
                </div>

                <div className="setting-group">
                  <label htmlFor="maxBookingAdvance">Maximum Booking Advance (days)</label>
                  <input
                    type="number"
                    id="maxBookingAdvance"
                    name="maxBookingAdvance"
                    value={settings.maxBookingAdvance}
                    onChange={handleChange}
                    className="setting-input"
                    min="1"
                  />
                  <small>How many days in advance can users book</small>
                </div>

                <div className="setting-group">
                  <label htmlFor="minBookingDuration">Minimum Booking Duration (minutes)</label>
                  <input
                    type="number"
                    id="minBookingDuration"
                    name="minBookingDuration"
                    value={settings.minBookingDuration}
                    onChange={handleChange}
                    className="setting-input"
                    min="15"
                    step="15"
                  />
                  <small>Shortest allowed booking time</small>
                </div>

                <div className="setting-group">
                  <label htmlFor="cancellationBuffer">Cancellation Buffer (hours)</label>
                  <input
                    type="number"
                    id="cancellationBuffer"
                    name="cancellationBuffer"
                    value={settings.cancellationBuffer}
                    onChange={handleChange}
                    className="setting-input"
                    min="0"
                  />
                  <small>Hours before meeting to allow cancellation</small>
                </div>
              </div>
            </section>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <section className="settings-section">
              <h2>Notification Settings</h2>
              
              <div className="settings-panel">
                <div className="setting-group">
                  <label htmlFor="emailNotifications">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={handleChange}
                      className="setting-checkbox"
                    />
                    Email Notifications
                  </label>
                  <small>Receive booking updates via email</small>
                </div>

                <div className="setting-group">
                  <label htmlFor="smsNotifications">
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      name="smsNotifications"
                      checked={settings.smsNotifications}
                      onChange={handleChange}
                      className="setting-checkbox"
                    />
                    SMS Notifications
                  </label>
                  <small>Receive booking updates via SMS</small>
                </div>
              </div>
            </section>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <section className="settings-section">
              <h2>Display Settings</h2>
              
              <div className="settings-panel">
                <div className="setting-group">
                  <label htmlFor="darkMode">
                    <input
                      type="checkbox"
                      id="darkMode"
                      name="darkMode"
                      checked={settings.darkMode}
                      onChange={handleChange}
                      className="setting-checkbox"
                    />
                    Dark Mode (Coming Soon)
                  </label>
                  <small>Use dark theme for the interface</small>
                </div>

                <div className="setting-group">
                  <label htmlFor="language">Language</label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    className="setting-select"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Save Button */}
        <div className="settings-footer">
          <button className="btn btn-primary btn-large" onClick={handleSave}>
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
