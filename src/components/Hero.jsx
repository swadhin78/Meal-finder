import { useNavigate } from 'react-router-dom'

export default function Hero({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <div className="hero">
      <div className="hero-content">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search recipes here ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <svg viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
          </button>
        </form>
        <h1>What are your favorite cuisines?</h1>
        <p>Personalize your experience</p>
      </div>
    </div>
  )
}
