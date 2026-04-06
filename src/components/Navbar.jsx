import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const BASE = 'https://www.themealdb.com/api/json/v1/1'

export default function Navbar({ searchQuery, setSearchQuery }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${BASE}/categories.php`)
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate('/')
  }

  return (
    <>
      <nav>
        <Link to="/" className="nav-logo">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          MEAL FINDER
        </Link>
        <div className="hamburger" onClick={() => setSidebarOpen(true)}>
          <span /><span /><span />
        </div>
      </nav>

      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="close-btn" onClick={() => setSidebarOpen(false)}>✕</div>
        </div>
        <ul className="sidebar-list">
          {categories.map(cat => (
            <li key={cat.idCategory}>
              <Link to={`/category/${cat.strCategory}`} onClick={() => setSidebarOpen(false)}>
                {cat.strCategory}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
