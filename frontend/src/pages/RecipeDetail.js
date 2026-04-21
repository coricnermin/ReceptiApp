import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await api.get(`/recipes/${id}`);
      setRecipe(res.data);
    } catch (err) {
      alert('Greška pri učitavanju recepta.');
      navigate('/');
    }
  };

  if (!recipe) return <p>Učitavanje...</p>;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
      <button onClick={() => navigate(-1)} className="btn" style={{marginBottom: '20px'}}>Nazad</button>
      
      {recipe.image && (
        <img 
          src={`http://localhost:8000/storage/${recipe.image}`} 
          alt={recipe.title} 
          style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px'}} 
        />
      )}
      
      <h1 style={{margin: '0 0 10px'}}>{recipe.title}</h1>
      <p style={{color: '#666', borderBottom: '1px solid #eee', paddingBottom: '15px'}}>
        Kategorija: <strong>{recipe.category?.name}</strong> | 
        Autor: <strong>{recipe.user?.name}</strong> | 
        Vrijeme: <strong>{recipe.prep_time} min</strong> | 
        Porcije: <strong>{recipe.servings}</strong>
      </p>

      <div style={{display: 'flex', gap: '30px', marginTop: '20px'}}>
        <div style={{flex: 1}}>
          <h3>Sastojci</h3>
          <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>{recipe.ingredients}</p>
        </div>
        
        <div style={{flex: 2}}>
          <h3>Upute za pripremu</h3>
          <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>{recipe.instructions}</p>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;