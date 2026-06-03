import Order from "../models/Order.js";


// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (

  req,
  res

) => {

  try {
//  console.log(req.body);
    const {

      customer,
      products,
      totalPrice,
      seller,

    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (

      !customer ||
      !products ||
      !totalPrice ||
      !seller

    ) {

      return res.status(400).json({

        success: false,
        message: "All fields are required",

      });

    }

    // =========================
    // CREATE ORDER
    // =========================

    const order = await Order.create({

      customerId:
        req.user.id,

      customer,

      products,

      totalPrice,

      seller,

      status: "Pending",

      deliveryStatus:
        "Pending",

    });

    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({

      success: true,

      message:
        "Order placed successfully",

      order,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Order failed",

      error:
        error.message,

    });

  }

};


// ========================================
// GET SELLER ORDERS
// ========================================

export const getSellerOrders = async (

  req,
  res

) => {

  try {

    const sellerId =
      req.user.id;

    const orders =
      await Order.find({

        seller: sellerId,

      }).sort({

        createdAt: -1,

      });

    res.status(200).json({

      success: true,

      totalOrders:
        orders.length,

      orders,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch seller orders",

    });

  }

};


// ========================================
// GET CUSTOMER ORDERS
// ========================================

export const getCustomerOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find({

          customerId:
            req.user.id,

        }).sort({

          createdAt: -1,

        });

      res.status(200).json({

        success: true,

        orders,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch customer orders",

      });

    }

  };


// ========================================
// SELLER RESPONSE
// ========================================

export const respondToOrder = async (

  req,
  res

) => {

  try {

    const {

      sellerResponse,
      deliveryCharge,
      discount,
      finalTotal,
      expectedDeliveryDate,
      sellerMessage,

    } = req.body;

    // =========================
    // FIND ORDER
    // =========================

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {

      return res.status(404).json({

        success: false,

        message:
          "Order not found",

      });

    }

    // =========================
    // ALREADY RESPONDED
    // =========================

    if (
      order.status !==
      "Pending"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Response already sent",

      });

    }

    // =========================
    // SAVE RESPONSE
    // =========================

    order.sellerResponse =
      sellerResponse;

    order.deliveryCharge =
      deliveryCharge;

    order.discount =
      discount;

    order.finalTotal =
      finalTotal;

    order.expectedDeliveryDate =
      expectedDeliveryDate;

    order.sellerMessage =
      sellerMessage;

    order.status =
      "Seller Responded";

    order.sellerRespondedAt =
      new Date();

    // =========================
    // SAVE
    // =========================

    await order.save();

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({

      success: true,

      message:
        "Seller response saved successfully",

      order,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to save seller response",

      error:
        error.message,

    });

  }

};


// ========================================
// CUSTOMER RESPONSE
// ========================================

export const customerResponse =
  async (req, res) => {

    try {

      const {

        customerDecision,
        paymentMethod,

      } = req.body;

      // =========================
      // FIND ORDER
      // =========================

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }

      // =========================
      // CUSTOMER CONFIRMED
      // =========================

      if (
        customerDecision ===
        "Confirmed"
      ) {

        order.customerDecision =
          "Confirmed";

        order.status =
          "Confirmed";

        order.confirmedAt =
          new Date();

      }

      // =========================
      // CUSTOMER CANCELLED
      // =========================

      if (
        customerDecision ===
        "Cancelled"
      ) {

        order.customerDecision =
          "Cancelled";

        order.status =
          "Cancelled";

      }

      // =========================
      // PAYMENT METHOD
      // =========================

      if (paymentMethod) {

        order.paymentMethod =
          paymentMethod;

      }

      // =========================
      // SAVE
      // =========================

      await order.save();

      res.status(200).json({

        success: true,

        message:
          "Customer response saved",

        order,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to update order",

      });

    }

  };


// ========================================
// UPDATE DELIVERY STATUS
// ========================================

export const updateDeliveryStatus =
  async (req, res) => {

    try {

      const {

        deliveryStatus,

      } = req.body;

      // =========================
      // FIND ORDER
      // =========================

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }

      // =========================
      // MUST BE CONFIRMED
      // =========================

      if (
        order.status !==
        "Confirmed"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Customer not confirmed yet",

        });

      }

      // =========================
      // UPDATE STATUS
      // =========================

      order.deliveryStatus =
        deliveryStatus;

      // =========================
      // AUTO COMPLETE
      // =========================

      if (
        deliveryStatus ===
        "Delivered"
      ) {

        order.deliveredAt =
          new Date();

      }

      // =========================
      // SAVE
      // =========================

      await order.save();

      res.status(200).json({

        success: true,

        message:
          "Delivery status updated",

        order,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to update delivery status",

      });

    }

  };