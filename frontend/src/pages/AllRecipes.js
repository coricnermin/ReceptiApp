import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecipes = async () => {
    try {
      const url = activeCategory ? `/recipes?category_id=${activeCategory}` : '/recipes';
      const res = await api.get(url);
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="filter-bar">
        <div className="categories">
          <button 
            className={`category-btn ${activeCategory === '' ? 'active' : ''}`}
            onClick={() => setActiveCategory('')}
          >
            Sve
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <Link to="/dodaj-recept" className="btn">Dodaj recept</Link>
      </div>

      <div className="recipe-grid">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card" onClick={() => navigate(`/recept/${recipe.id}`)}>
            {recipe.image ? (
              <img src={`http://localhost:8000/storage/${recipe.image}`} alt={recipe.title} className="recipe-image" />
            ) : (
              <div className="recipe-image" style={{backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Nema slike</div>
            )}
            <div className="recipe-content">
              <h3 className="recipe-title">{recipe.title}</h3>
              <p className="recipe-meta">{recipe.category?.name} | {recipe.prep_time} min</p>
              <p className="recipe-meta">Autor: {recipe.user?.name}</p>
            </div>
          </div>
        ))}
        {recipes.length === 0 && <p>Nema recepata za prikaz.</p>}
      </div>
    </div>
  );
}

export default AllRecipes;