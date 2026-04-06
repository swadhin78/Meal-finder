import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Hero from '../components/Hero'

const BASE = 'https://www.themealdb.com/api/json/v1/1'

export default function Home({ searchQuery, setSearchQuery }) {
  const [categories, setCategories] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [catsLoading, setCatsLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('search') || ''

  useEffect(() => {
    fetch(`${BASE}/categories.php`)
      .then(r => r.json())
      .then(d => { setCategories(d.categories || []); setCatsLoading(false) })
  }, [])

  useEffect(() => {
    if (!query) { setSearchResults(null); return }
    setSearchQuery(query)
    setLoading(true)
    fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(d => { setSearchResults(d.meals || []); setLoading(false) })
  }, [query])

  return (
    <>
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {searchResults !== null && (
        <div className="section">
          <div className="section-title">Meals</div>
          <div className="title-underline" />
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : searchResults.length === 0 ? (
            <div className="empty">No meals found for "{query}"</div>
          ) : (
            <div className="meal-grid">
              {searchResults.map(meal => (
                <div key={meal.idMeal} className="meal-card" onClick={() => navigate(`/meal/${meal.idMeal}`)}>
                  <div className="meal-card-img">
                    <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
                    <span className="category-badge">{meal.strCategory}</span>
                  </div>
                  <div className="meal-card-info">
                    <div className="meal-area">{meal.strArea}</div>
                    <div className="meal-name">{meal.strMeal}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={`section ${searchResults !== null ? 'section-gray' : ''}`}>
        <div className="section-title">Categories</div>
        <div className="title-underline" />
        {catsLoading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <div className="category-grid">
            {categories.map(cat => (
              <div key={cat.idCategory} className="category-card" onClick={() => navigate(`/category/${cat.strCategory}`)}>
                <img src={cat.strCategoryThumb} alt={cat.strCategory} loading="lazy" />
                <span className="category-badge">{cat.strCategory}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
