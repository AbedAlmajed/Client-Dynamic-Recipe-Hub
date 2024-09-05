import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

// Utility functions to manage the cart in local storage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : null;
};

const Catalogdishes = () => {

  const [desserts, setDesserts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:1001/api/records");
      const data = response.data;

      // Get chefId from sessionStorage
      const chefId = sessionStorage.getItem("selectedChefId");

      // Filter dishes based on chef's id
      const filteredDesserts = data.filter(
        (dessert) => dessert.chef === chefId
      );

      setDesserts(filteredDesserts);

    } catch (e) {
      console.log(e);
    }
  };

  const handleCardClick = (dessert) => {
    sessionStorage.setItem("selectedDessert", JSON.stringify(dessert));
    navigate(`/DishDetail`);
  };

  // Function to add a dish to the cart
  const addToCart = (dessert) => {
    let cart = getCartFromLocalStorage();
  
    if (!cart) {
      cart = {
        items: [],
        chef: dessert.chef,
        total: 0,
      };
    }
  
    // Check if the dish is from the same chef
    if (cart.chef !== dessert.chef) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Action',
        text: 'You can only add items from the same chef.',
      });
      return;
    }
  
    // Add or update the item in the cart
    const existingItem = cart.items.find(item => item.dish._id === dessert._id);
    if (existingItem) {
      // Check if adding one more would exceed the available quantity
      if (existingItem.quantity + 1 > dessert.availableQuantity) {
        Swal.fire({
          icon: 'error',
          title: 'Quantity Exceeded',
          text: 'Cannot add more items. Exceeds available quantity.',
        });
        return;
      }
      existingItem.quantity += 1;
    } else {
      // Check if adding this item would exceed the available quantity
      if (1 > dessert.availableQuantity) {
        Swal.fire({
          icon: 'error',
          title: 'Quantity Exceeded',
          text: 'Cannot add more items. Exceeds available quantity.',
        });
        return;
      }
      cart.items.push({ dish: dessert, quantity: 1 });
    }
  
    // Update total price
    cart.total = cart.items.reduce((acc, item) => acc + (item.dish.price * item.quantity), 0);
  
    saveCartToLocalStorage(cart);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: 'Dish added to cart!',
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Desserts Dishes</h2>
        <p className="text-gray-600">{desserts.length}</p>
        <select className="mt-2 p-2 border rounded">
          {desserts.map((dessert, index) => (
            <option key={index}>{dessert.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {desserts.map((dessert, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          >
            <img
              src={dessert.images[0]} // Display the first image in the array
              alt={dessert.name}
              className="w-full h-48 object-cover"
              onClick={() => handleCardClick(dessert)}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{dessert.name}</h3>
              <button
                onClick={() => addToCart(dessert)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogdishes;
