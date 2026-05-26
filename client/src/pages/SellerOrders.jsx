import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

import {
  Eye,
  MapPin,
  CheckCircle,
  XCircle,
  Minus,
  Plus,
} from "lucide-react";

const SellerOrders = () => {

  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [sellerResponse, setSellerResponse] =
    useState({});

  const [deliveryCharge, setDeliveryCharge] =
    useState(0);

  const [discount, setDiscount] =
    useState(0);

    const [expectedDeliveryDate, setExpectedDeliveryDate] =
  useState("");

const [sellerMessage, setSellerMessage] =
  useState("");
  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token =
          localStorage.getItem(
            "gavathi_token"
          );

        const { data } =
          await axios.get(

            `${import.meta.env.VITE_API_URL}/api/orders/seller-orders`,

            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }

          );

        if (data.success) {

          setOrders(data.orders);

        }

      } catch (error) {

        console.log(error);

      }

    };

    fetchOrders();

  }, []);

  // =========================
  // INITIALIZE PRODUCT
  // =========================

  const initializeProduct = (item) => {

    setSellerResponse((prev) => {

      if (prev[item.productId]) {
        return prev;
      }

      return {

        ...prev,

        [item.productId]: {
          availableQty: item.quantity,
          finalPrice:
            item.quantity * item.price,
          availability: "Available",
        },

      };

    });

  };

  // =========================
  // QTY CHANGE
  // =========================

  const handleQtyChange = (
    item,
    qty
  ) => {

    const safeQty = Math.max(
      0,
      Number(qty || 0)
    );

    const availability =
      sellerResponse[item.productId]
        ?.availability || "Available";

    const finalPrice =
      availability ===
      "Not Available"
        ? 0
        : safeQty * Number(item.price);

    setSellerResponse((prev) => ({

      ...prev,

      [item.productId]: {

        ...prev[item.productId],

        availableQty: safeQty,
        finalPrice,

      },

    }));

  };

  // =========================
  // INCREMENT
  // =========================

  const incrementQty = (item) => {

    const currentQty =
      sellerResponse[item.productId]
        ?.availableQty ??
      item.quantity;

    handleQtyChange(
      item,
      currentQty + 1
    );

  };

  // =========================
  // DECREMENT
  // =========================

  const decrementQty = (item) => {

    const currentQty =
      sellerResponse[item.productId]
        ?.availableQty ??
      item.quantity;

    if (currentQty <= 0) return;

    handleQtyChange(
      item,
      currentQty - 1
    );

  };

  // =========================
  // STATUS CHANGE
  // =========================

  const handleStatusChange = (
    item,
    value
  ) => {

    const currentQty =
      sellerResponse[item.productId]
        ?.availableQty ??
      item.quantity;

    let updatedPrice =
      currentQty * Number(item.price);

    let updatedQty = currentQty;

    // NOT AVAILABLE
    if (
      value === "Not Available"
    ) {

      updatedPrice = 0;
      updatedQty = 0;

    }

    // LIMITED STOCK
    if (
      value === "Limited Stock" &&
      currentQty >
        item.quantity
    ) {

      updatedQty = item.quantity;

      updatedPrice =
        updatedQty *
        Number(item.price);

    }

    setSellerResponse((prev) => ({

      ...prev,

      [item.productId]: {

        ...prev[item.productId],

        availability: value,
        availableQty: updatedQty,
        finalPrice: updatedPrice,

      },

    }));

  };

  // =========================
  // CALCULATE TOTAL
  // =========================

  const calculateTotal = () => {

    let subtotal = 0;

    Object.values(
      sellerResponse
    ).forEach((item) => {

      subtotal += Number(
        item.finalPrice || 0
      );

    });

    const delivery =
      Math.max(
        0,
        Number(deliveryCharge || 0)
      );

    const discountValue =
      Math.max(
        0,
        Number(discount || 0)
      );

    const finalTotal =
      subtotal +
      delivery -
      discountValue;

    return finalTotal > 0
      ? finalTotal
      : 0;

  };

  // =========================
  // SEND RESPONSE
  // =========================

  const sendResponse = async () => {

    try {

      const token =
        localStorage.getItem(
          "gavathi_token"
        );

      await axios.put(

        `${import.meta.env.VITE_API_URL}/api/orders/respond/${selectedOrder._id}`,

            {
            sellerResponse,

            deliveryCharge:
                Number(deliveryCharge),

            discount:
                Number(discount),

            finalTotal:
                calculateTotal(),

            expectedDeliveryDate,

            sellerMessage,

            status:
                "Seller Responded",
            },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      toast.success(
  "Response sent successfully"
);
      setSelectedOrder(null);
      window.location.reload();

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = (
    status
  ) => {

    if (status === "Pending") {

      return "bg-yellow-400 text-black";

    }

    if (
      status === "Confirmed"
    ) {

      return "bg-green-600 text-white";

    }

    return "bg-blue-500 text-white";

  };

  return (

    <div className="min-h-screen bg-[#f6fff8] pt-28 px-3 sm:px-4 pb-20 overflow-x-hidden">

      <div className="max-w-5xl mx-auto">

        {/* TITLE */}

        <div className="mb-8">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14532d]">

            Orders

          </h1>

        </div>

        {/* ORDERS */}

        <div className="space-y-6">

          {
            orders.map((order) => (

              <div
                key={order._id}
                className="bg-white rounded-[28px] shadow-lg overflow-hidden border border-green-100"
              >

                {/* TOP */}

                <div className="bg-[#14532d] p-5 text-white">

                  <div className="flex justify-between items-center gap-3">

                    <div>

                      <h2 className="text-xl sm:text-2xl font-extrabold">

                        {
                          order.customer
                            ?.name
                        }

                      </h2>

                      <p className="text-green-100 mt-1 text-base sm:text-lg">

                        ₹
                        {
                          order.totalPrice
                        }

                      </p>

                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg ${getStatusStyle(order.status)}`}
                    >

                      {order.status}

                    </div>

                  </div>

                </div>

                {/* BODY */}

                <div className="p-5">

                  <div className="flex items-center gap-2 text-gray-600">

                    <MapPin
                      size={18}
                      className="text-green-700"
                    />

                    <p className="font-medium text-sm sm:text-base">

                      {
                        order
                          .customer
                          ?.taluka
                      }
                      ,
                      {" "}
                      {
                        order
                          .customer
                          ?.district
                      }

                    </p>

                  </div>

                  <button

                    onClick={() => {

                      setSelectedOrder(
                        order
                      );

                      setDeliveryCharge(
                        0
                      );

                      setDiscount(
                        0
                      );

                      order.products.forEach(
                        (
                          item
                        ) =>
                          initializeProduct(
                            item
                          )
                      );

                    }}

                    className="mt-5 bg-[#14532d] hover:bg-[#166534] text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >

                    <Eye size={18} />

                    View Details

                  </button>

                </div>

              </div>

            ))
          }

        </div>

        {/* MODAL */}

        {
          selectedOrder && (

            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-4">

              <div className="bg-white w-full max-w-4xl rounded-[28px] p-4 sm:p-6 max-h-[95vh] overflow-y-auto shadow-2xl">

                {/* HEADER */}

                <div className="flex justify-between items-center gap-3 mb-7">

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14532d]">

                    Order Details

                  </h2>

                  <button

                    onClick={() =>
                      setSelectedOrder(
                        null
                      )
                    }

                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl font-bold"
                  >

                    Back

                  </button>

                </div>

                {/* ADDRESS */}

                <div className="bg-[#f0fdf4] rounded-3xl p-5 mb-7 border border-green-100">

                  <h3 className="font-extrabold text-[#14532d] text-xl sm:text-2xl mb-4">

                    Delivery Address

                  </h3>

                  <div className="space-y-2 text-gray-700 text-sm sm:text-base break-words">

                    <p className="font-bold text-lg sm:text-xl text-[#14532d]">

                      {
                        selectedOrder
                          .customer
                          ?.name
                      }

                    </p>

                    <p>
                      {
                        selectedOrder
                          .customer
                          ?.address
                      }
                    </p>

                    <p>

                      {
                        selectedOrder
                          .customer
                          ?.taluka
                      }
                      ,
                      {" "}
                      {
                        selectedOrder
                          .customer
                          ?.district
                      }

                    </p>

                    <p>

                      PIN:
                      {" "}
                      {
                        selectedOrder
                          .customer
                          ?.pinCode
                      }

                    </p>

                    <p className="break-all">

                      WhatsApp:
                      {" "}
                      {
                        selectedOrder
                          .customer
                          ?.whatsappNumber
                      }

                    </p>

                  </div>

                </div>

                {/* PRODUCTS */}

                <div className="space-y-5">

                  {
                    selectedOrder.products.map(
                      (
                        item,
                        index
                      ) => {

                        const currentData =
                          sellerResponse[
                            item
                              .productId
                          ] || {};

                        return (

                          <div
                            key={index}
                            className="border border-green-100 rounded-3xl p-4 sm:p-5"
                          >

                            {/* TOP */}

                            <div className="flex justify-between items-start gap-3">

                              <div>

                                <h2 className="text-xl sm:text-2xl font-extrabold text-[#14532d]">

                                  {
                                    item.name
                                  }

                                </h2>

                                <p className="text-gray-500 mt-1 text-sm sm:text-base">

                                  Requested:
                                  {" "}
                                  {
                                    item.quantity
                                  }

                                </p>

                              </div>

                              <h2 className="text-2xl sm:text-3xl font-extrabold text-green-700 whitespace-nowrap">

                                ₹
                                {
                                  item.price
                                }

                              </h2>

                            </div>

                            {/* INPUTS */}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                              {/* QTY */}

                              <div className="bg-[#f8fffb] border-2 border-green-100 rounded-2xl p-3">

                                <p className="text-sm font-semibold text-gray-600 mb-3">

                                  Available Qty

                                </p>

                                <div className="flex items-center justify-between gap-3">

                                  <button

                                    onClick={() =>
                                      decrementQty(
                                        item
                                      )
                                    }

                                    className="w-11 h-11 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all duration-300 active:scale-95"

                                  >

                                    <Minus
                                      size={
                                        18
                                      }
                                      className="text-[#14532d]"
                                    />

                                  </button>

                                  <input
                                    type="number"
                                    value={
                                      currentData.availableQty ??
                                      item.quantity
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      handleQtyChange(
                                        item,
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                    className="w-full text-center text-lg font-bold outline-none bg-transparent"
                                  />

                                  <button

                                    onClick={() =>
                                      incrementQty(
                                        item
                                      )
                                    }

                                    className="w-11 h-11 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all duration-300 active:scale-95"

                                  >

                                    <Plus
                                      size={
                                        18
                                      }
                                      className="text-[#14532d]"
                                    />

                                  </button>

                                </div>

                              </div>

                              {/* PRICE */}

                              <div className="bg-[#f8fffb] border-2 border-green-100 rounded-2xl p-4 flex flex-col justify-center">

                                <p className="text-sm font-semibold text-gray-600 mb-2">

                                  Total Price

                                </p>

                                <h2 className="text-2xl font-extrabold text-green-700">

                                  ₹
                                  {
                                    currentData.finalPrice ??
                                    item.price *
                                      item.quantity
                                  }

                                </h2>

                              </div>

                              {/* STATUS */}

                              <div className="relative">

                                <select

                                  value={
                                    currentData.availability ||
                                    "Available"
                                  }

                                  onChange={(
                                    e
                                  ) =>
                                    handleStatusChange(
                                      item,
                                      e
                                        .target
                                        .value
                                    )
                                  }

                                  className="w-full h-full min-h-[95px] bg-[#f8fffb] border-2 border-green-100 rounded-2xl px-4 py-4 font-semibold text-green-900 outline-none focus:border-green-600 appearance-none cursor-pointer"

                                >

                                  <option value="Available">

                                    ✅ Available

                                  </option>

                                  <option value="Limited Stock">

                                    ⚠️ Limited Stock

                                  </option>

                                  <option value="Not Available">

                                    ❌ Not Available

                                  </option>

                                </select>

                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 pointer-events-none">

                                  ▼

                                </div>

                              </div>

                            </div>

                          </div>

                        );

                      }
                    )
                  }

                </div>

                {/* BILLING */}

                <div className="bg-[#f0fdf4] rounded-3xl p-5 sm:p-6 mt-8 border border-green-100">

                  <h2 className="text-2xl font-extrabold text-[#14532d] mb-5">

                    Billing Summary

                  </h2>

                  <div className="space-y-4">

                    {/* DELIVERY */}

                    <div className="flex justify-between items-center gap-4">

                      <p className="font-semibold text-gray-700 text-sm sm:text-base">

                        Delivery Charge

                      </p>

                      <input
                        type="number"
                        min="0"
                        value={
                          deliveryCharge
                        }
                        onChange={(e) =>
                          setDeliveryCharge(
                            Math.max(
                              0,
                              Number(
                                e
                                  .target
                                  .value
                              )
                            )
                          )
                        }
                        className="border-2 border-green-100 rounded-2xl p-3 w-28 sm:w-40 outline-none focus:border-green-600"
                      />

                    </div>

                    {/* DISCOUNT */}

                    <div className="flex justify-between items-center gap-4">

                      <p className="font-semibold text-gray-700 text-sm sm:text-base">

                        Discount

                      </p>

                      <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) =>
                          setDiscount(
                            Math.max(
                              0,
                              Number(
                                e
                                  .target
                                  .value
                              )
                            )
                          )
                        }
                        className="border-2 border-green-100 rounded-2xl p-3 w-28 sm:w-40 outline-none focus:border-green-600"
                      />

                    </div>
                    {/* EXPECTED DELIVERY DATE */}

                    <div className="flex justify-between items-center gap-4">

                    <p className="font-semibold text-gray-700 text-sm sm:text-base">

                        Expected Delivery

                    </p>

                    <input
                        type="date"
                        min={
                        new Date()
                            .toISOString()
                            .split("T")[0]
                        }
                        value={
                        expectedDeliveryDate
                        }
                        onChange={(e) =>
                        setExpectedDeliveryDate(
                            e.target.value
                        )
                        }
                        className="border-2 border-green-100 rounded-2xl p-3 w-40 sm:w-52 outline-none focus:border-green-600"
                    />

                    </div>

                    {/* SELLER MESSAGE */}

                    <div className="flex flex-col gap-2">

                    <p className="font-semibold text-gray-700 text-sm sm:text-base">

                        Seller Message

                    </p>

                    <textarea
                        rows="3"
                        placeholder="Write delivery or stock note..."
                        value={sellerMessage}
                        onChange={(e) =>
                        setSellerMessage(
                            e.target.value
                        )
                        }
                        className="border-2 border-green-100 rounded-2xl p-4 outline-none focus:border-green-600 resize-none"
                    />

                    </div>

                    {/* TOTAL */}

                    <div className="bg-white rounded-2xl p-5 mt-5 flex justify-between items-center shadow-sm">

                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#14532d]">

                        Final Total

                      </h2>

                      <h2 className="text-3xl sm:text-4xl font-extrabold text-green-700">

                        ₹
                        {
                          calculateTotal()
                        }

                      </h2>

                    </div>

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="flex flex-col sm:flex-row gap-4 mt-8">

                  <button

                    onClick={
                      sendResponse
                    }

                    className="flex-1 bg-[#14532d] hover:bg-[#166534] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                  >

                    <CheckCircle size={20} />

                    Send Response

                  </button>

                  <button

                    onClick={() =>
                      setSelectedOrder(
                        null
                      )
                    }

                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                  >

                    <XCircle size={20} />

                    Cancel

                  </button>

                </div>

              </div>

            </div>

          )
        }

      </div>

    </div>

  );

};

export default SellerOrders;