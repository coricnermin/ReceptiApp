import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

function RecipeForm({ editMode }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    ingredients: '',
    instructions: '',
    prep_time: '',
    servings: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCategories();
    if (editMode && id) {
      fetchRecipeData();
    }
  }, [editMode, id]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecipeData = async () => {
    try {
      const res = await api.get(`/recipes/${id}`);
      setFormData({
        title: res.data.title,
        category_id: res.data.category_id,
        ingredients: res.data.ingredients,
        instructions: res.data.instructions,
        prep_time: res.data.prep_time,
        servings: res.data.servings
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) {
      setError('Molimo odaberite kategoriju.');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (image) {
      data.append('image', image);
    }

    try {
      if (editMode) {
        data.append('_method', 'PUT'); // Laravel quirk for File upload on PUT
        await api.post(`/recipes/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/recipes', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/moji-recepti');
    } catch (err) {
      setError(err.response?.data?.message || 'Došlo je do greške pri spašavanju recepta.');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>{editMode ? 'Uredi recept' : 'Dodaj novi recept'}</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Naziv jela</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label>Kategorija</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange} required>
            <option value="">Odaberite kategoriju...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sastojci</label>
          <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} required rows="4" />
        </div>

        <div className="form-group">
          <label>Upute za pripremu</label>
          <textarea name="instructions" value={formData.instructions} onChange={handleChange} required rows="5" />
        </div>

        <div style={{display: 'flex', gap: '20px'}}>
          <div className="form-group" style={{flex: 1}}>
            <label>Vrijeme pripreme (min)</label>
            <input type="number" name="prep_time" value={formData.prep_time} onChange={handleChange} required min="1" />
          </div>
          <div className="form-group" style={{flex: 1}}>
            <label>Broj porcija</label>
            <input type="number" name="servings" value={formData.servings} onChange={handleChange} required min="1" />
          </div>
        </div>

        <div className="form-group">
          <label>Slika jela</label>
          <input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" />
        </div>

        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
          <button type="submit" className="btn">Sačuvaj</button>
          <button type="button" onClick={() => navigate(-1)} className="btn btn-danger">Otkaži</button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;