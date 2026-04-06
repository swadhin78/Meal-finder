import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Category from './pages/Category'
import MealDetail from './pages/MealDetail'
import './index.css'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <BrowserRouter>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/category/:name" element={<Category searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/meal/:id" element={<MealDetail searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
      </Routes>
    </BrowserRouter>
  )
}
