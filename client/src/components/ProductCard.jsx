import React from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {

  // =========================
  // CART
  // =========================

  const {
    addToCart,
    increaseQty,
    decreaseQty,
    cartItems,
  } = useCart();

  // =========================
  // FIND PRODUCT IN CART
  // =========================

  const cartItem = cartItems.find(
    (item) => item._id === product._id
  );

  const quantity = cartItem ? cartItem.qty : 0;

  return (

    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="
        bg-white
        rounded-3xl
        shadow-lg
        overflow-hidden
        hover:shadow-2xl
        transition-all
        duration-300
        relative
      "
    >

      {/* ========================= */}
      {/* PRODUCT IMAGE */}
      {/* ========================= */}

      <Link to={`/product/${product._id}`}>

        <div className="relative">

          <img
            src={product.image}
            alt={product.name}
            className="
              h-60
              w-full
              object-cover
              hover:scale-105
              transition-transform
              duration-500
            "
          />

          {/* ========================= */}
          {/* FLOATING ADD BUTTON */}
          {/* ========================= */}

          <div className="absolute bottom-4 right-4">

            {
              quantity === 0 ? (

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="
                    bg-white
                    text-[#14532d]
                    font-bold
                    px-5
                    py-2
                    rounded-xl
                    shadow-xl
                    border
                    border-green-200
                    hover:bg-[#14532d]
                    hover:text-white
                    transition-all
                    duration-300
                  "
                >
                  ADD
                </button>

              ) : (

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    bg-white
                    px-3
                    py-2
                    rounded-xl
                    shadow-xl
                    border
                    border-green-200
                  "
                >

                  {/* MINUS */}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      decreaseQty(product._id);
                    }}
                    className="
                      w-7
                      h-7
                      rounded-lg
                      bg-red-500
                      text-white
                      font-bold
                      text-lg
                      hover:scale-110
                      transition
                    "
                  >
                    -
                  </button>

                  {/* QTY */}

                  <span className="font-bold text-lg text-gray-800">
                    {quantity}
                  </span>

                  {/* PLUS */}

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      increaseQty(product._id);
                    }}
                    className="
                      w-7
                      h-7
                      rounded-lg
                      bg-green-600
                      text-white
                      font-bold
                      text-lg
                      hover:scale-110
                      transition
                    "
                  >
                    +
                  </button>

                </div>

              )
            }

          </div>

        </div>

      </Link>

      {/* ========================= */}
      {/* PRODUCT DETAILS */}
      {/* ========================= */}

      <div className="p-5">

        <h2 className="text-2xl font-bold text-[#14532d]">
          {product.name}
        </h2>

        <p className="mt-2 text-lg text-orange-600 font-semibold">
          ₹{product.price}
        </p>

      </div>

    </motion.div>

  );

};

export default ProductCard;