import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the recipe details
    api.get(`/recipes/${id}`)
      .then(response => setRecipe(response.data))
      .catch(error => {
        console.error('Error fetching recipe:', error);
        setError('Failed to fetch recipe.');
      });

    // Fetch the list of cuisines
    api.get('cuisine/getCuisine')
      .then(response => {
        if (Array.isArray(response.data.cuisine)) {
          setCuisines(response.data.cuisine);
        } else {
          setError('Error fetching cuisines. Please try again.');
        }
      })
      .catch(error => setError('Error fetching cuisines. Please try again.'));
  }, [id]);

  const getCuisineName = (cuisineId) => {
    const cuisine = cuisines.find(c => c._id === cuisineId);
    return cuisine ? cuisine.name : 'Unknown';
  };

  if (error) return <p className="text-red-600 font-semibold">{error}</p>;
  if (!recipe) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-6 border-r border-gray-200">
        <h2 className="text-2xl font-semibold mb-6">Navigation</h2>
        <ul className="space-y-4">
          <li><a href="#" className="text-blue-600 hover:underline">Dashboard</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">My Recipes</a></li>
          <li><a href="#" className="text-blue-600 hover:underline">Settings</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6 space-y-8 mt-16">
        <h1 className="text-4xl font-extrabold mb-8">{recipe.title}</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <p className="text-2xl font-semibold mb-4">Ingredients</p>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-lg">{ingredient.name}: {ingredient.quantity}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <p className="text-2xl font-semibold mb-4">Instructions</p>
          <p className="text-lg">{recipe.instructions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <p className="text-2xl font-semibold mb-4">Cooking Time</p>
          <p className="text-lg">{recipe.cookingTime} minutes</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <p className="text-2xl font-semibold mb-4">Categories</p>
          <p className="text-lg">{recipe.categories.join(', ')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <p className="text-2xl font-semibold mb-4">Cuisine</p>
          <p className="text-lg">{getCuisineName(recipe.cuisine.name)}</p>
        </div>
        {recipe.images.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <p className="text-2xl font-semibold mb-4">Images</p>
            <div className="flex flex-wrap gap-4">
              {recipe.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Recipe Image ${index}`}
                  className="w-48 h-48 object-cover rounded-lg border border-gray-300 shadow-md"
                />
              ))}
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <p className="text-2xl font-semibold mb-4">Ratings</p>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ratings.map((rating, index) => (
              <li key={index} className="text-lg">{rating.rating} stars - {rating.comment}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default RecipeDetail;
