import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {

  const {
    addToCart,
    removeFromCart,
    cartItems,
  } = useCart();

  // =========================
  // FIND PRODUCT IN CART
  // =========================

  const cartItem = cartItems.find(
    (item) => item._id === product._id
  );

  const quantity = cartItem
    ? cartItem.quantity
    : 0;

  // =========================
  // CLOUDINARY IMAGE
  // =========================

  const productImage =
    product.images?.find(
      (img) =>
        img &&
        img.includes("cloudinary")
    ) ||
    "https://via.placeholder.com/500x500?text=No+Image";

  return (

    <motion.div

      whileHover={{
        y: -5,
      }}

      transition={{
        duration: 0.25,
      }}

      className="
        bg-white
        rounded-[24px]
        overflow-hidden
        shadow-md
        hover:shadow-2xl
        transition-all
        duration-300
        border
        border-green-100
        flex
        flex-col
        h-full
      "
    >

      {/* ================= IMAGE ================= */}

      <Link
        to={`/product/${product._id}`}
        className="block"
      >

        <div className="
          relative
          bg-[#f5f5f5]
          overflow-hidden
        ">

          <img
            src={productImage}

            alt={product.name}

            onError={(e) => {

              e.target.src =
                "https://via.placeholder.com/500x500?text=No+Image";

            }}

            className="
              w-full
              h-[180px]
              sm:h-[230px]
              object-cover
              hover:scale-105
              transition-transform
              duration-500
            "
          />

          {/* STOCK */}

          <div
            className={`
              absolute
              top-3
              left-3
              px-3
              py-1
              rounded-full
              text-[10px]
              sm:text-xs
              font-bold
              text-white
              shadow-md
              ${
                product.stock > 0
                  ? "bg-green-600"
                  : "bg-red-500"
              }
            `}
          >

            {
              product.stock > 0
                ? "In Stock"
                : "Sold Out"
            }

          </div>

          {/* CART BUTTON */}

          <div className="
            absolute
            bottom-3
            right-3
          ">

            {
              quantity === 0 ? (

                <button
                  onClick={(e) => {

                    e.preventDefault();

                    addToCart(product);

                  }}
                  className="
                    bg-white
                    text-green-700
                    font-bold
                    text-xs
                    sm:text-sm
                    px-5
                    py-2
                    rounded-xl
                    shadow-lg
                    border
                    border-green-200
                    hover:bg-green-700
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
                    shadow-lg
                    border
                    border-green-200
                  "
                >

                  <button
                    onClick={(e) => {

                      e.preventDefault();

                      removeFromCart(product._id);

                    }}
                    className="
                      w-7
                      h-7
                      rounded-lg
                      bg-red-500
                      text-white
                      font-bold
                      text-sm
                    "
                  >
                    -
                  </button>

                  <span className="
                    font-bold
                    text-sm
                    text-gray-800
                  ">
                    {quantity}
                  </span>

                  <button
                    onClick={(e) => {

                      e.preventDefault();

                      addToCart(product);

                    }}
                    className="
                      w-7
                      h-7
                      rounded-lg
                      bg-green-600
                      text-white
                      font-bold
                      text-sm
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

      {/* ================= DETAILS ================= */}

      <div className="
        p-4
        flex
        flex-col
        justify-between
        flex-1
      ">

        <div>

          {/* PRODUCT NAME */}

          <h2
            className="
              text-[18px]
              sm:text-[22px]
              font-extrabold
              text-[#14532d]
              capitalize
              leading-tight
              line-clamp-2
              min-h-[55px]
            "
          >
            {product.name}
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              text-gray-500
              text-xs
              sm:text-sm
              mt-2
              line-clamp-2
              min-h-[40px]
            "
          >
            {
              product.description ||
              "Fresh Gavathi village product"
            }
          </p>

        </div>

        {/* PRICE */}

        <div className="
          flex
          items-center
          justify-between
          mt-5
        ">

          <div>

            <p className="
              text-orange-600
              font-black
              text-xl
              sm:text-2xl
            ">
              ₹{product.price}
            </p>

            <span className="
              text-[11px]
              text-gray-400
            ">
              Per Item
            </span>

          </div>

          <div
            className="
              bg-green-50
              text-green-700
              text-[11px]
              sm:text-xs
              font-bold
              px-3
              py-1.5
              rounded-full
            "
          >
            {product.stock} left
          </div>

        </div>

      </div>

    </motion.div>

  );

};

export default ProductCard;