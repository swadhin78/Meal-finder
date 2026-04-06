import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Hero from '../components/Hero'

const BASE = 'https://www.themealdb.com/api/json/v1/1'

export default function MealDetail({ searchQuery, setSearchQuery }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [meal, setMeal] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${BASE}/lookup.php?i=${id}`).then(r => r.json()),
      fetch(`${BASE}/categories.php`).then(r => r.json())
    ]).then(([mealData, catsData]) => {
      setMeal(mealData.meals?.[0] || null)
      setCategories(catsData.categories || [])
      setLoading(false)
    })
  }, [id])

  const getIngredients = (m) => {
    const items = []
    for (let i = 1; i <= 20; i++) {
      const ing = m[`strIngredient${i}`]
      const mea = m[`strMeasure${i}`]
      if (ing && ing.trim()) items.push({ name: ing.trim(), measure: mea?.trim() || '' })
    }
    return items
  }

  const getInstructions = (m) => {
    if (!m.strInstructions) return []
    return m.strInstructions.split('\r\n').filter(s => s.trim().length > 0)
  }

  return (
    <>
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : !meal ? (
        <div className="empty">Meal not found.</div>
      ) : (
        <>
          <div className="breadcrumb">
            <Link to="/">🏠</Link>
            <span>»</span>
            <span>{meal.strMeal.toUpperCase()}</span>
          </div>

          <div className="section">
            <div className="section-title">Meal Details</div>
            <div className="title-underline" />

            <div style={{border: '1px solid var(--gray-mid)', borderRadius: 8, overflow: 'hidden'}}>
              <div style={{background: 'var(--orange)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{color: 'white', fontFamily: 'Montserrat', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8}}>
                  🏠 MEAL FINDER
                </span>
                <div style={{display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer'}}>
                  <span style={{display:'block',height:2,width:20,background:'white',borderRadius:2}}/>
                  <span style={{display:'block',height:2,width:20,background:'white',borderRadius:2}}/>
                  <span style={{display:'block',height:2,width:20,background:'white',borderRadius:2}}/>
                </div>
              </div>

              <div style={{padding: '1.5rem'}}>
                <div className="detail-grid">
                  <img src={meal.strMealThumb} alt={meal.strMeal} className="detail-img" />
                  <div className="detail-meta">
                    <div className="detail-title">{meal.strMeal}</div>
                    <div className="detail-field"><strong>Category</strong>{meal.strCategory}</div>
                    {meal.strSource && (
                      <div className="detail-field">
                        <strong>Source</strong>
                        <a href={meal.strSource} target="_blank" rel="noreferrer" style={{color: 'var(--orange)', wordBreak: 'break-all', fontSize: '0.8rem'}}>
                          {meal.strSource.substring(0, 50)}...
                        </a>
                      </div>
                    )}
                    {meal.strTags && (
                      <div className="detail-field">
                        <strong>Tags</strong>
                        <div style={{display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4}}>
                          {meal.strTags.split(',').map(tag => (
                            <span key={tag} className="tag-pill">{tag.trim()}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(() => {
                      const ingredients = getIngredients(meal)
                      return (
                        <div className="ingredients-box">
                          <h4>Ingredients</h4>
                          <div className="ingredients-grid">
                            {ingredients.map((ing, i) => (
                              <div key={i} className="ingredient-item">
                                <div className="ing-num">{i + 1}</div>
                                <span>{ing.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {(() => {
                  const ingredients = getIngredients(meal)
                  return (
                    <div className="measures-box" style={{marginBottom: '1.5rem'}}>
                      <h4>Measure:</h4>
                      <div className="measures-grid">
                        {ingredients.map((ing, i) => (
                          <div key={i} className="measure-item">
                            {ing.measure || 'to taste'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}

                <div className="instructions-box">
                  <h4>Instructions:</h4>
                  {getInstructions(meal).map((step, i) => (
                    <div key={i} className="instruction-step">
                      <div className="step-check" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="section section-gray">
        <div className="section-title">Categories</div>
        <div className="title-underline" />
        <div className="category-grid">
          {categories.map(cat => (
            <div key={cat.idCategory} className="category-card" onClick={() => navigate(`/category/${cat.strCategory}`)}>
              <img src={cat.strCategoryThumb} alt={cat.strCategory} loading="lazy" />
              <span className="category-badge">{cat.strCategory}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
