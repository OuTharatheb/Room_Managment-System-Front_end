import { useState } from 'react'
import Home from './Home'
import Room from './Room'
import Bookings from './Bookings'
import Settings from './Settings'
import Users from './Users'
import Reports from './Reports'
import Sidebar from './Sidebar'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('bookings')

  const renderPage = () => {
    switch (currentPage) {
      case 'bookings':
        return <Bookings />
      case 'rooms':
        return <Room />
      case 'home':
        return <Home />
      case 'users':
        return <Users />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Bookings />
    }
  }

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
