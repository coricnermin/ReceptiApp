import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const res = await api.get('/my-recipes');
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Jeste li sigurni da želite obrisati ovaj recept?')) {
      try {
        await api.delete(`/recipes/${id}`);
        fetchMyRecipes();
      } catch (err) {
        alert('Greška pri brisanju!');
      }
    }
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/uredi-recept/${id}`);
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2>Moji recepti</h2>
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
              
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                <button onClick={(e) => handleEdit(recipe.id, e)} className="btn" style={{backgroundColor: '#f39c12', padding: '5px 10px', fontSize: '13px'}}>Uredi</button>
                <button onClick={(e) => handleDelete(recipe.id, e)} className="btn btn-danger" style={{padding: '5px 10px', fontSize: '13px'}}>Obriši</button>
              </div>
            </div>
          </div>
        ))}
        {recipes.length === 0 && <p>Još uvijek niste dodali nijedan recept.</p>}
      </div>
    </div>
  );
}

export default MyRecipes;