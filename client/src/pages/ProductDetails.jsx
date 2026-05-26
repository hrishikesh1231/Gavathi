import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";

import { useCart } from "../context/CartContext";

import { useWishlist } from "../context/WishlistContext";

const ProductDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] =
    useState("");

  // =========================
  // CART
  // =========================

  const {
    cartItems,
    addToCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  // =========================
  // WISHLIST
  // =========================

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );

        setProduct(res.data.product);

        setSelectedImage(
          res.data.product.images?.[0]
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-[#fefce8]
        via-[#dcfce7]
        to-[#bbf7d0]
      ">

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="
            w-16
            h-16
            border-4
            border-[#14532d]
            border-t-transparent
            rounded-full
          "
        />

      </div>

    );

  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!product) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        <h1 className="
          text-3xl
          font-bold
          text-red-500
        ">

          Product Not Found

        </h1>

      </div>

    );

  }

  // =========================
  // CART ITEM
  // =========================

  const cartItem = cartItems.find(
    (item) => item._id === product._id
  );

  // =========================
  // WISHLIST
  // =========================

  const liked = isInWishlist(product._id);

  return (

    <section className="
      min-h-screen
      bg-gradient-to-br
      from-[#fefce8]
      via-[#dcfce7]
      to-[#bbf7d0]
      pt-24
      pb-14
      px-3
      sm:px-5
    ">

      {/* BACK BUTTON */}

      <div className="max-w-7xl mx-auto mb-5">

        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ x: -4 }}
          onClick={() => navigate(-1)}
          className="
            flex
            items-center
            gap-2
            bg-white
            px-5
            py-3
            rounded-2xl
            shadow-lg
            border
            border-green-100
            text-[#14532d]
            font-bold
          "
        >

          <ArrowLeft size={20} />

          Back

        </motion.button>

      </div>

      {/* MAIN CARD */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          max-w-7xl
          mx-auto
          bg-white/90
          rounded-[35px]
          shadow-2xl
          overflow-hidden
          border border-white/40
        "
      >

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
        ">

          {/* ========================= */}
          {/* IMAGE SECTION */}
          {/* ========================= */}

          <div className="
            bg-[#f0fdf4]
            relative
            p-5
            sm:p-8
          ">

            {/* HEART BUTTON */}

            <button
              onClick={() =>
                toggleWishlist(product)
              }
              className="
                absolute
                top-5
                right-5
                z-20
                w-12
                h-12
                rounded-full
                bg-white
                shadow-xl
                flex
                items-center
                justify-center
                transition-all
                duration-300
                hover:scale-110
              "
            >

              <Heart
                size={22}
                className={
                  liked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                }
              />

            </button>

            {/* MAIN IMAGE */}

            <motion.img
              whileHover={{
                scale: 1.02,
              }}
              transition={{
                duration: 0.3,
              }}
              src={
                selectedImage ||
                "https://via.placeholder.com/600x600?text=No+Image"
              }
              alt={product.name}
              className="
                w-full
                h-[320px]
                sm:h-[450px]
                object-cover
                rounded-[30px]
                shadow-2xl
              "
            />

            {/* THUMBNAILS */}

            <div className="
              flex
              gap-4
              mt-5
              overflow-x-auto
              pb-2
            ">

              {product.images?.map(
                (img, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      setSelectedImage(img)
                    }
                    className={`
                      min-w-[90px]
                      h-[90px]
                      rounded-2xl
                      overflow-hidden
                      border-4
                      transition-all
                      duration-300
                      ${
                        selectedImage === img
                          ? "border-green-600"
                          : "border-transparent"
                      }
                    `}
                  >

                    <img
                      src={img}
                      alt="product"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  </button>

                )
              )}

            </div>

          </div>

          {/* ========================= */}
          {/* DETAILS */}
          {/* ========================= */}

          <div className="
            p-5
            sm:p-8
            md:p-12
          ">

            {/* TAGS */}

            <div className="flex flex-wrap gap-3">

              <span className="
                bg-[#14532d]
                text-white
                px-5
                py-2
                rounded-full
                text-sm
                font-bold
              ">

                100% Organic

              </span>

              <span className="
                bg-orange-100
                text-orange-600
                px-4
                py-2
                rounded-full
                text-sm
                font-bold
              ">

                Fresh Village Product

              </span>

              <span className="
                bg-green-100
                text-green-700
                px-4
                py-2
                rounded-full
                text-sm
                font-bold
              ">

                {product.stock} In Stock

              </span>

            </div>

            {/* NAME */}

            <h1 className="
              text-4xl
              sm:text-5xl
              font-black
              text-[#14532d]
              mt-6
              capitalize
            ">

              {product.name}

            </h1>

            {/* DESCRIPTION */}

            <p className="
              text-gray-600
              text-base
              sm:text-lg
              leading-relaxed
              mt-6
            ">

              {product.description}

            </p>

            {/* RATING */}

            <div className="
              flex
              items-center
              gap-2
              mt-6
            ">

              <div className="
                flex
                items-center
                gap-1
                bg-yellow-100
                text-yellow-700
                px-4
                py-2
                rounded-xl
                font-bold
              ">

                <Star
                  size={18}
                  fill="currentColor"
                />

                4.8

              </div>

              <p className="text-gray-500">

                1.2k Reviews

              </p>

            </div>

            {/* PRICE */}

            <div className="mt-8">

              <h2 className="
                text-5xl
                sm:text-6xl
                font-black
                text-orange-500
              ">

                ₹{product.price}

              </h2>

            </div>

            {/* FEATURES */}

            <div className="
              grid
              grid-cols-2
              gap-4
              mt-8
            ">

              <div className="
                bg-[#f0fdf4]
                rounded-2xl
                p-4
                flex
                items-center
                gap-3
              ">

                <ShieldCheck
                  className="text-green-700"
                  size={26}
                />

                <div>

                  <h3 className="
                    font-bold
                    text-[#14532d]
                  ">

                    Pure Quality

                  </h3>

                  <p className="
                    text-sm
                    text-gray-500
                  ">

                    100% Natural

                  </p>

                </div>

              </div>

              <div className="
                bg-[#f0fdf4]
                rounded-2xl
                p-4
                flex
                items-center
                gap-3
              ">

                <Truck
                  className="text-green-700"
                  size={26}
                />

                <div>

                  <h3 className="
                    font-bold
                    text-[#14532d]
                  ">

                    Fast Delivery

                  </h3>

                  <p className="
                    text-sm
                    text-gray-500
                  ">

                    Within 24hrs

                  </p>

                </div>

              </div>

            </div>

            {/* CART */}

            <div className="mt-10">

              {!cartItem ? (

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => addToCart(product)}
                  className="
                    w-full
                    sm:w-auto
                    flex
                    items-center
                    justify-center
                    gap-3
                    bg-[#14532d]
                    hover:bg-[#166534]
                    text-white
                    px-10
                    py-4
                    rounded-2xl
                    font-bold
                    text-lg
                    shadow-xl
                  "
                >

                  <ShoppingCart size={22} />

                  ADD TO CART

                </motion.button>

              ) : (

                <div className="
                  flex
                  items-center
                  justify-between
                  sm:justify-start
                  gap-6
                  bg-[#f0fdf4]
                  p-4
                  rounded-3xl
                  w-full
                  sm:w-fit
                ">

                  <button
                    onClick={() =>
                      decreaseQty(product._id)
                    }
                    className="
                      w-14
                      h-14
                      bg-red-500
                      text-white
                      rounded-2xl
                      text-3xl
                      font-bold
                    "
                  >

                    -

                  </button>

                  <span className="
                    text-3xl
                    font-black
                    text-[#14532d]
                    min-w-[40px]
                    text-center
                  ">

                    {cartItem.quantity}

                  </span>

                  <button
                    onClick={() =>
                      increaseQty(product._id)
                    }
                    className="
                      w-14
                      h-14
                      bg-green-600
                      text-white
                      rounded-2xl
                      text-3xl
                      font-bold
                    "
                  >

                    +

                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </motion.div>

    </section>

  );

};

export default ProductDetails;