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
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'rooms':
        return <Room />
      case 'bookings':
        return <Bookings />
      case 'users':
        return <Users />
      case 'reports':
        return <Reports />
      case 'settings':
        return <Settings />
      default:
        return <Home />
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
