import Order from "../models/Order.js";


// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (

  req,

  res

) => {

  try {

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

    });


    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({

      success: true,

      message: "Order placed successfully",

      order,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: "Order failed",

      error: error.message,

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

    // logged in seller id

    const sellerId =
      req.user.id;

    // find seller orders

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
// SELLER RESPONSE TO ORDER
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

      status,

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
      status;

    // =========================
    // SAVE ORDER
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

        status,

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
      // UPDATE ORDER
      // =========================

      order.customerDecision =
        customerDecision;

      if (paymentMethod) {

        order.paymentMethod =
          paymentMethod;

      }

      order.status =
        status;

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