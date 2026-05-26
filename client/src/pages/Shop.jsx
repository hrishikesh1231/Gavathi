import React, {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import ProductCard from "../components/ProductCard";

import axios from "axios";

const Shop = () => {

  // =========================
  // STATES
  // =========================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        // =========================
        // ONLY PRODUCTS WITH CLOUDINARY IMAGES
        // =========================

        const formattedProducts =
          res.data.products.map((product) => ({

            ...product,

            // MAIN IMAGE
            image:
              product.images?.[0] ||

              "https://via.placeholder.com/300",

            // ALL IMAGES
            images:
              product.images || [],

          }));

        setProducts(formattedProducts);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);

  return (

    <motion.section

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
        min-h-screen
        bg-gradient-to-br
        from-[#fefce8]
        via-[#dcfce7]
        to-[#bbf7d0]
        pt-24
        px-3
        sm:px-5
        pb-24
      "
    >

      <div className="max-w-7xl mx-auto">

        {/* ================= HERO ================= */}

        <div className="
          text-center
          mb-10
        ">

          <div className="
            inline-flex
            items-center
            gap-2
            bg-white
            shadow-md
            px-4
            py-2
            rounded-full
            mb-4
          ">

            <span>🌿</span>

            <span className="
              text-xs
              sm:text-sm
              font-semibold
              text-[#14532d]
            ">

              Fresh Organic Konkan Products

            </span>

          </div>

          <h1 className="
            text-3xl
            sm:text-5xl
            font-extrabold
            text-[#14532d]
            leading-tight
          ">

            Shop Gavathi Products

          </h1>

          <p className="
            mt-3
            text-sm
            sm:text-base
            text-gray-700
            max-w-2xl
            mx-auto
            leading-relaxed
          ">

            Fresh homemade village products directly from Konkan sellers.

          </p>

        </div>

        {/* ================= HEADER ================= */}

        <div className="
          flex
          items-center
          justify-between
          mb-6
          px-1
        ">

          <h2 className="
            text-lg
            sm:text-2xl
            font-bold
            text-[#14532d]
          ">

            Available Products

          </h2>

          <div className="
            bg-white
            shadow-md
            px-4
            py-2
            rounded-full
            text-xs
            sm:text-sm
            font-bold
            text-[#14532d]
          ">

            {products.length} Products

          </div>

        </div>

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="
            flex
            flex-col
            items-center
            justify-center
            py-28
          ">

            <div className="
              w-14
              h-14
              border-4
              border-[#14532d]
              border-t-transparent
              rounded-full
              animate-spin
            " />

            <h2 className="
              mt-5
              text-xl
              font-bold
              text-[#14532d]
            ">

              Loading Products...

            </h2>

          </div>

        ) : (

          <>
            {

              products.length > 0 ? (

                <div className="
                  grid
                  grid-cols-2
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  gap-4
                  sm:gap-6
                  items-stretch
                ">

                  {

                    products.map((product) => (

                      <motion.div

                        key={product._id}

                        initial={{
                          opacity: 0,
                          y: 20,
                        }}

                        animate={{
                          opacity: 1,
                          y: 0,
                        }}

                        transition={{
                          duration: 0.3,
                        }}

                        className="h-full"
                      >

                        <ProductCard
                          product={product}
                        />

                      </motion.div>

                    ))

                  }

                </div>

              ) : (

                <div className="
                  bg-white
                  rounded-[35px]
                  shadow-xl
                  py-20
                  px-5
                  text-center
                ">

                  <div className="
                    text-6xl
                    mb-5
                  ">
                    😔
                  </div>

                  <h2 className="
                    text-2xl
                    sm:text-4xl
                    font-bold
                    text-[#14532d]
                  ">

                    No Products Found

                  </h2>

                  <p className="
                    text-gray-500
                    mt-4
                  ">

                    Products will appear here once sellers add them.

                  </p>

                </div>

              )

            }

          </>

        )}

      </div>

    </motion.section>

  );

};

export default Shop;