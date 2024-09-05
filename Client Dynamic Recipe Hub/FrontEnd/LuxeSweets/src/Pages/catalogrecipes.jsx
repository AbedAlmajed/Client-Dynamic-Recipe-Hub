import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
const Catalogrecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const response = await axios.get("http://localhost:1001/api/recipe");
      const data = response.data;
      console.log(data);
      setRecipes(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCardClick = (recipe) => {
    sessionStorage.setItem("selectedRecipe", JSON.stringify(recipe));

    navigate(`/Recipesdetail`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Display filters and sorting options */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Desserts Recipes</h2>
        <p className="text-gray-600">{recipes.length} Results</p>
        <select className="mt-2 p-2 border rounded">
          {recipes.map((recipe, index) => (
            <option key={index}>{recipe.categories[0]}</option>
          ))}
        </select>
      </div>

      {/* Display recipes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => handleCardClick(recipe)}
          >
            <img
              src={recipe.images[0]}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{recipe.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center"></div>
    </div>
  );
};

export default Catalogrecipes;
