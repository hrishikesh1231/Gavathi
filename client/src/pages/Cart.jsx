import { useState } from "react";

import axios from "axios";

import toast from "react-hot-toast";

import { useCart } from "../context/CartContext";

const Cart = () => {

  const {
    cartItems,
    increaseQty,
    decreaseQty,
  } = useCart();

  // =========================
  // POPUP
  // =========================

  const [showConfirmPopup, setShowConfirmPopup] =
    useState(false);

  // =========================
  // FORM DATA
  // =========================

  const [formData, setFormData] = useState({

    name: "",
    address: "",
    taluka: "",
    district: "",
    pinCode: "",
    whatsappNumber: "",
    callingNumber: "",

  });

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    setFormData({

      ...formData,
      [e.target.name]: e.target.value,

    });

  };

  // =========================
  // TOTAL PRICE
  // =========================

  const totalPrice = cartItems.reduce(

    (acc, item) =>
      acc + item.price * item.qty,

    0

  );

  // =========================
  // PLACE ORDER
  // =========================

// =========================
// PLACE ORDER
// =========================

const handlePlaceOrder = async () => {

  // =========================
  // EMPTY FIELD VALIDATION
  // =========================

  if (

    !formData.name.trim() ||
    !formData.address.trim() ||
    !formData.taluka.trim() ||
    !formData.district.trim() ||
    !formData.pinCode.trim() ||
    !formData.callingNumber.trim()

  ) {

    toast.error(
      "All delivery fields are required"
    );

    return;

  }

  // =========================
  // PHONE VALIDATION
  // =========================

  const phoneRegex = /^[0-9]{10}$/;

  if (
    !phoneRegex.test(
      formData.callingNumber
    )
  ) {

    toast.error(
      "Calling number must be exactly 10 digits"
    );

    return;

  }

  // =========================
  // WHATSAPP VALIDATION
  // =========================

  if (

    formData.whatsappNumber &&

    !phoneRegex.test(
      formData.whatsappNumber
    )

  ) {

    toast.error(
      "WhatsApp number must be exactly 10 digits"
    );

    return;

  }

  // =========================
  // PINCODE VALIDATION
  // =========================

  const pinRegex = /^[0-9]{6}$/;

  if (
    !pinRegex.test(formData.pinCode)
  ) {

    toast.error(
      "Pin code must be exactly 6 digits"
    );

    return;

  }

  // =========================
  // EMPTY CART VALIDATION
  // =========================

  if (cartItems.length === 0) {

    toast.error(
      "Your cart is empty"
    );

    return;

  }

  // =========================
  // SELLER VALIDATION
  // =========================

  if (!cartItems[0]?.seller) {

    toast.error(
      "Seller information missing"
    );

    return;

  }
  const token =
  localStorage.getItem(
    "gavathi_token"
  );

  try {

    // =========================
    // SAVE ORDER
    // =========================

await axios.post(

  `${import.meta.env.VITE_API_URL}/api/orders/create`,

  {

    customer: formData,

    products: cartItems.map((item) => ({

      productId: item._id,

      name: item.name,

      image: item.image,

      price: item.price,

      quantity: item.qty,

    })),

    totalPrice,

    seller: cartItems[0]?.seller,

  },

  {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  }

);

    // =========================
    // CLEAR FORM
    // =========================

    setFormData({

      name: "",
      address: "",
      taluka: "",
      district: "",
      pinCode: "",
      whatsappNumber: "",
      callingNumber: "",

    });

    // =========================
    // CLEAR CART
    // =========================

    cartItems.forEach((item) => {

      for (
        let i = 0;
        i < item.qty;
        i++
      ) {

        decreaseQty(item._id);

      }

    });

    // =========================
    // SUCCESS
    // =========================

    toast.success(

      "Order request sent successfully 🌿",

      {

        duration: 3500,

      }

    );

  } catch (error) {

    console.log(error);

    toast.error(

      error?.response?.data?.message ||

      "Failed to place order"

    );

  }

};

  return (

    <section className="min-h-screen bg-gradient-to-br from-[#fefce8] via-[#dcfce7] to-[#bbf7d0] pt-24 pb-32 px-3 sm:px-5">

      <div className="max-w-7xl mx-auto">

        {/* ========================= */}
        {/* PAGE TITLE */}
        {/* ========================= */}

        <div className="mb-8">

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14532d]">

            My Cart

          </h1>

          <p className="text-gray-600 mt-2 text-sm sm:text-base">

            Review your products and place your order

          </p>

        </div>

        {/* ========================= */}
        {/* EMPTY CART */}
        {/* ========================= */}

        {cartItems.length === 0 ? (

          <div className="bg-white rounded-[30px] shadow-xl p-10 text-center">

            <h2 className="text-2xl font-bold text-[#14532d]">

              Your Cart is Empty

            </h2>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ========================= */}
            {/* LEFT SIDE */}
            {/* ========================= */}

            <div className="lg:col-span-2 space-y-5">

              {cartItems.map((item) => (

                <div
                  key={item._id}
                  className="bg-white rounded-[28px] shadow-lg p-4 sm:p-5 flex items-center justify-between gap-4"
                >

                  {/* PRODUCT INFO */}

                  <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md"
                    />

                    <div className="min-w-0">

                      <h2 className="text-lg sm:text-2xl font-bold text-[#14532d] truncate">

                        {item.name}

                      </h2>

                      <p className="text-orange-500 font-bold text-lg sm:text-2xl mt-1">

                        ₹{item.price}

                      </p>

                      <p className="text-gray-500 text-sm mt-1">

                        Fresh Organic Product

                      </p>

                    </div>

                  </div>

                  {/* ========================= */}
                  {/* QTY */}
                  {/* ========================= */}

                  <div className="flex flex-col items-center gap-2">

                    <button
                      onClick={() =>
                        increaseQty(item._id)
                      }
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xl transition-all duration-300"
                    >

                      +

                    </button>

                    <span className="font-bold text-lg sm:text-xl text-[#14532d]">

                      {item.qty}

                    </span>

                    <button
                      onClick={() =>
                        decreaseQty(item._id)
                      }
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xl transition-all duration-300"
                    >

                      -

                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* ========================= */}
            {/* RIGHT SIDE */}
            {/* ========================= */}

            <div className="bg-white rounded-[30px] shadow-2xl p-5 sm:p-7 h-fit sticky top-28">

              {/* TITLE */}

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532d] mb-6">

                Delivery Details

              </h2>

              {/* NAME */}

              <div className="mb-4">

                <label className="text-sm font-semibold text-gray-700">

                  Full Name

                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#14532d]"
                />

              </div>

              {/* ADDRESS */}

              <div className="mb-4">

                <label className="text-sm font-semibold text-gray-700">

                  Delivery Address

                </label>

                <textarea
                  rows="3"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full delivery address"
                  className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#14532d]"
                />

              </div>

              {/* TALUKA */}

              <div className="mb-4">

                <label className="text-sm font-semibold text-gray-700">

                  Taluka

                </label>

                <input
                  type="text"
                  name="taluka"
                  value={formData.taluka}
                  onChange={handleChange}
                  placeholder="Enter taluka"
                  className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#14532d]"
                />

              </div>

              {/* DISTRICT */}

              <div className="mb-4">

                <label className="text-sm font-semibold text-gray-700">

                  District

                </label>

                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#14532d]"
                />

              </div>

              {/* PINCODE */}

              <div className="mb-4">

                <label className="text-sm font-semibold text-gray-700">

                  Pin Code

                </label>

                <input
                  type="text"
                  name="pinCode"
                  maxLength={6}
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="Enter pin code"
                  className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#14532d]"
                />

              </div>

              {/* WHATSAPP */}

              <div className="mb-4">

                <label className="text-sm font-semibold text-gray-700">

                  WhatsApp Number
                  <span className="text-gray-400 text-xs ml-2">

                    (Optional)

                  </span>

                </label>

                <input
                  type="text"
                  name="whatsappNumber"
                  maxLength={10}
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#14532d]"
                />

              </div>

              {/* CALLING NUMBER */}

              <div className="mb-6">

                <label className="text-sm font-semibold text-gray-700">

                  Calling Number

                </label>

                <input
                  type="text"
                  name="callingNumber"
                  maxLength={10}
                  value={formData.callingNumber}
                  onChange={handleChange}
                  placeholder="Enter calling number"
                  className="w-full mt-2 border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-[#14532d]"
                />

              </div>

              {/* TOTAL */}

              <div className="bg-[#f0fdf4] rounded-2xl p-4 mb-6">

                <div className="flex items-center justify-between">

                  <span className="text-gray-600 font-medium">

                    Total Amount

                  </span>

                  <span className="text-3xl font-extrabold text-[#14532d]">

                    ₹{totalPrice}

                  </span>

                </div>

              </div>

              {/* BUTTON */}

              <button
                onClick={() =>
                  setShowConfirmPopup(true)
                }
                className="w-full bg-[#14532d] hover:bg-[#166534] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              >

                Proceed Order

              </button>

              {/* NOTE */}

              <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">

                Seller will verify availability and delivery feasibility before confirming your order.

              </p>

            </div>

          </div>

        )}

      </div>

      {/* ========================= */}
      {/* CONFIRM POPUP */}
      {/* ========================= */}

      {showConfirmPopup && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-lg rounded-[35px] shadow-2xl p-7 animate-[popup_0.3s_ease]">

            {/* ICON */}

            <div className="flex items-center justify-center mb-5">

              <div className="w-20 h-20 rounded-full bg-[#14532d] flex items-center justify-center shadow-xl">

                <span className="text-4xl">

                  🌿

                </span>

              </div>

            </div>

            {/* TITLE */}

            <h2 className="text-3xl font-extrabold text-center text-[#14532d]">

              Confirm Your Order

            </h2>

            {/* MESSAGE */}

            <p className="text-gray-600 text-center leading-relaxed mt-5 text-sm sm:text-base">

              Your order request will be securely forwarded to the seller.

              <br />
              <br />

              Seller will intelligently verify:

              <br />

              • Product availability
              <br />
              • Delivery location feasibility
              <br />
              • Estimated delivery timeline

              <br />
              <br />

              Once verified, seller may respond with confirmation and possible discounts within 24 hours.

              <br />
              <br />

              Thank you for choosing
              <span className="font-bold text-[#14532d]">

                {" "}Gavathi 💚

              </span>

            </p>

            {/* TOTAL */}

            <div className="bg-[#f0fdf4] rounded-2xl p-4 mt-6">

              <div className="flex items-center justify-between">

                <span className="font-medium text-gray-600">

                  Order Total

                </span>

                <span className="text-3xl font-extrabold text-[#14532d]">

                  ₹{totalPrice}

                </span>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="flex gap-4 mt-8">

              {/* CANCEL */}

              <button
                onClick={() =>
                  setShowConfirmPopup(false)
                }
                className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300"
              >

                Cancel

              </button>

              {/* PLACE ORDER */}

              <button
                onClick={() => {

                  setShowConfirmPopup(false);

                  handlePlaceOrder();

                }}
                className="flex-1 bg-[#14532d] hover:bg-[#166534] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300"
              >

                Place Order

              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  );

};

export default Cart;