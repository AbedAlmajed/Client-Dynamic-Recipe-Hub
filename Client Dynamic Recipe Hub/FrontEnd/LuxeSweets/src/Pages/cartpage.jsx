import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : { items: [], total: 0 };
};

const clearCartFromLocalStorage = () => {
  localStorage.removeItem("cart");
};

const CartPage = () => {
  const [cart, setCart] = useState(getCartFromLocalStorage());
  const [totalPrice, setTotalPrice] = useState(cart.total);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate("/Catalogdishes"); // Redirect to catalog if cart is empty
    } else {
      calculateTotalPrice();
    }
  }, [cart, navigate]);

  const calculateTotalPrice = () => {
    const total = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.dish.price,
      0
    );
    setTotalPrice(total);
    // Update total price in the cart object and local storage
    const updatedCart = { ...cart, total };
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    clearCartFromLocalStorage();
    setCart({ items: [], total: 0 }); // Clear cart state
    setTotalPrice(0); // Reset total price
    navigate("/PaymentComponent");
  };

  const handleRemoveItem = (index) => {
    const updatedCart = { ...cart };
    updatedCart.items.splice(index, 1);
    if (updatedCart.items.length === 0) {
      clearCartFromLocalStorage();
      setCart({ items: [], total: 0 });
    } else {
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    calculateTotalPrice();
  };

  const adjustQuantity = (index, change) => {
    const updatedCart = { ...cart };
    const item = updatedCart.items[index];
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) return; // Prevent negative or zero quantities

    if (newQuantity > item.dish.availableQuantity) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Cannot add more than available quantity (${item.dish.availableQuantity})!`,
      });
      return;
    }

    item.quantity = newQuantity;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotalPrice(); // Ensure total price is recalculated
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Your Cart
        </h1>
        {cart.items.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">Your cart is empty.</p>
            <a
              href="/catalog"
              className="text-blue-500 font-semibold hover:underline"
            >
              Go back to the catalog
            </a>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <ul className="space-y-6">
              {cart.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border-b pb-4 mb-4 last:border-b-0"
                >
                  <div className="flex items-center">
                    <img
                      src={item.dish.images[0]} // Display the dish image
                      alt={item.dish.name}
                      className="w-24 h-24 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <p className="text-lg font-semibold text-gray-800">
                        {item.dish.name}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => adjustQuantity(index, -1)}
                          className="bg-gray-300 text-gray-600 px-4 py-2 rounded-l hover:bg-gray-400"
                        >
                          -
                        </button>
                        <p className="px-4 py-2 bg-gray-200 text-gray-700">
                          {item.quantity}
                        </p>
                        <button
                          onClick={() => adjustQuantity(index, 1)}
                          className="bg-gray-300 text-gray-600 px-4 py-2 rounded-r hover:bg-gray-400"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Price: ${item.dish.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: ${(item.quantity * item.dish.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="bg-red-600 text-white px-4 py-2 rounded ml-4 hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Total Price: ${totalPrice.toFixed(2)}
              </h2>
              <Link
                to="/PaymentComponent"
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Proceed to Payment
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
