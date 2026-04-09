import { useEffect, useState } from 'react'
import Home from './Home'
import Room from './Room'
import Bookings from './Bookings'
import Calendar from './Calendar'
import Settings from './Settings'
import Guest from './Guest'
import History from './History'
import Sidebar from './Sidebar'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('bookings')

  useEffect(() => {
    const handleNavigatePage = (event) => {
      const nextPage = event?.detail?.page
      if (typeof nextPage === 'string' && nextPage.length > 0) {
        setCurrentPage(nextPage)
      }
    }

    window.addEventListener('navigate-page', handleNavigatePage)
    return () => window.removeEventListener('navigate-page', handleNavigatePage)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'bookings':
        return <Bookings />
      case 'calendar':
        return <Calendar />
      case 'rooms':
        return <Room />
      case 'home':
        return <Home />
      case 'guests':
        return <Guest />
      case 'history':
        return <History />
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
