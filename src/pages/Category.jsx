import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Hero from '../components/Hero'

const BASE = 'https://www.themealdb.com/api/json/v1/1'

export default function Category({ searchQuery, setSearchQuery }) {
  const { name } = useParams()
  const navigate = useNavigate()
  const [meals, setMeals] = useState([])
  const [catInfo, setCatInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${BASE}/filter.php?c=${encodeURIComponent(name)}`).then(r => r.json()),
      fetch(`${BASE}/categories.php`).then(r => r.json())
    ]).then(([mealsData, catsData]) => {
      setMeals(mealsData.meals || [])
      const found = (catsData.categories || []).find(c => c.strCategory === name)
      setCatInfo(found || null)
      setLoading(false)
    })
  }, [name])

  return (
    <>
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {catInfo && (
        <div className="section">
          <div className="category-desc-box">
            <h3>{catInfo.strCategory}</h3>
            <p>{catInfo.strCategoryDescription}</p>
          </div>

          <div className="section-title">Meals</div>
          <div className="title-underline" />

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <div className="meal-grid">
              {meals.map(meal => (
                <div key={meal.idMeal} className="meal-card" onClick={() => navigate(`/meal/${meal.idMeal}`)}>
                  <div className="meal-card-img">
                    <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
                  </div>
                  <div className="meal-card-info">
                    <div className="meal-name">{meal.strMeal}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="section section-gray">
        <div className="section-title">Categories</div>
        <div className="title-underline" />
        <p style={{color: 'var(--text-light)', fontSize: '0.9rem'}}>
          <Link to="/" style={{color: 'var(--orange)'}}>← Back to home</Link> to browse all categories
        </p>
      </div>
    </>
  )
}
