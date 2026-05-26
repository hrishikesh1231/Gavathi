import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import toast from "react-hot-toast";

const Orders = () => {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "gavathi_token"
          );

        const { data } =
          await axios.get(

            `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );

        if (data.success) {

          setOrders(data.orders);

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to fetch orders"
        );

      } finally {

        setLoading(false);

      }

    };

  // =========================
  // CONFIRM ORDER
  // =========================

  const confirmOrder =
    async (
      orderId,
      paymentMethod
    ) => {

      try {

        const token =
          localStorage.getItem(
            "gavathi_token"
          );

        const { data } =
          await axios.put(

            `${import.meta.env.VITE_API_URL}/api/orders/customer-response/${orderId}`,

            {

              customerDecision:
                "Confirmed",

              paymentMethod,

              status:
                "Confirmed",

            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );

        if (data.success) {

          toast.success(
            "Order confirmed successfully"
          );

          fetchOrders();

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to confirm order"
        );

      }

    };

  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder =
    async (orderId) => {

      try {

        const token =
          localStorage.getItem(
            "gavathi_token"
          );

        const { data } =
          await axios.put(

            `${import.meta.env.VITE_API_URL}/api/orders/customer-response/${orderId}`,

            {

              customerDecision:
                "Cancelled",

              status:
                "Cancelled",

            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );

        if (data.success) {

          toast.success(
            "Order cancelled"
          );

          fetchOrders();

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to cancel order"
        );

      }

    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-[#14532d]">

        Loading Orders...

      </div>

    );

  }

  return (

    <section className="min-h-screen bg-gradient-to-br from-[#fefce8] via-[#dcfce7] to-[#bbf7d0] pt-24 pb-32 px-3 sm:px-5">

      <div className="max-w-6xl mx-auto">

        {/* TITLE */}

        <div className="mb-8">

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#14532d]">

            My Orders

          </h1>

          <p className="text-gray-600 mt-2">

            Track your orders and seller responses

          </p>

        </div>

        {/* EMPTY */}

        {orders.length === 0 ? (

          <div className="bg-white rounded-[30px] shadow-xl p-10 text-center">

            <h2 className="text-2xl font-bold text-[#14532d]">

              No Orders Yet

            </h2>

          </div>

        ) : (

          <div className="space-y-8">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-white rounded-[32px] shadow-2xl overflow-hidden"
              >

                {/* TOP */}

                <div className="bg-[#14532d] text-white p-5 flex justify-between items-center">

                  <div>

                    <h2 className="text-2xl font-extrabold">

                      Order Status

                    </h2>

                    <p className="text-green-100 mt-1">

                      {order.status}

                    </p>

                  </div>

                  <div className="text-right">

                    <h2 className="text-3xl font-extrabold">

                      ₹
                      {order.finalTotal > 0
                        ? order.finalTotal
                        : order.totalPrice}

                    </h2>

                  </div>

                </div>

                {/* PRODUCTS */}

                <div className="p-5 space-y-5">

                  {order.products.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex items-center gap-4 border-b border-gray-100 pb-4"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 rounded-2xl object-cover"
                        />

                        <div>

                          <h2 className="text-xl font-bold text-[#14532d]">

                            {item.name}

                          </h2>

                          <p className="text-gray-500 mt-1">

                            Quantity:
                            {" "}
                            {item.quantity}

                          </p>

                          <p className="text-orange-500 font-bold mt-1">

                            ₹
                            {item.price}

                          </p>

                        </div>

                      </div>

                    )
                  )}

                  {/* DELIVERY INFO */}

                  <div className="bg-[#f0fdf4] rounded-3xl p-5 mt-5">

                    <h2 className="text-2xl font-extrabold text-[#14532d] mb-4">

                      Delivery Details

                    </h2>

                    <div className="space-y-2 text-gray-700">

                      <p>

                        Name:
                        {" "}
                        {order.customer?.name}

                      </p>

                      <p>

                        Address:
                        {" "}
                        {order.customer?.address}

                      </p>

                      <p>

                        Taluka:
                        {" "}
                        {order.customer?.taluka}

                      </p>

                      <p>

                        District:
                        {" "}
                        {order.customer?.district}

                      </p>

                    </div>

                  </div>

                  {/* SELLER RESPONSE */}

                  {order.status ===
                    "Seller Responded" && (

                    <div className="bg-[#ecfdf5] border border-green-100 rounded-3xl p-5 mt-5">

                      <h2 className="text-2xl font-extrabold text-[#14532d] mb-5">

                        Seller Response

                      </h2>

                      <div className="space-y-3 text-gray-700">

                        <p>

                          Delivery Charge:
                          {" "}
                          ₹
                          {order.deliveryCharge}

                        </p>

                        <p>

                          Discount:
                          {" "}
                          ₹
                          {order.discount}

                        </p>

                        <p>

                          Final Total:
                          {" "}
                          ₹
                          {order.finalTotal}

                        </p>

                        <p>

                          Expected Delivery:
                          {" "}

                          {new Date(
                            order.expectedDeliveryDate
                          ).toLocaleDateString()}

                        </p>

                        <p>

                          Seller Message:
                          {" "}

                          {order.sellerMessage ||
                            "No message"}

                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 space-y-4">

                        {/* COD */}

                        <button
                          onClick={() =>
                            confirmOrder(
                              order._id,
                              "COD"
                            )
                          }
                          className="w-full bg-[#14532d] hover:bg-[#166534] text-white py-4 rounded-2xl font-bold transition-all duration-300"
                        >

                          Confirm with COD

                        </button>

                        {/* ONLINE */}

                        <button
                          onClick={() =>
                            confirmOrder(
                              order._id,
                              "ONLINE"
                            )
                          }
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold transition-all duration-300"
                        >

                          Pay Online

                        </button>

                        {/* CANCEL */}

                        <button
                          onClick={() =>
                            cancelOrder(
                              order._id
                            )
                          }
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold transition-all duration-300"
                        >

                          Cancel Order

                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>

  );

};

export default Orders;