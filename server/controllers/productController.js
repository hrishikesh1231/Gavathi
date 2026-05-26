import Product from "../models/Product.js";

// ======================================
// ADD PRODUCT
// ======================================

export const addProduct = async (
  req,
  res
) => {

  try {

    const {
      name,
      description,
      price,
      stock,
      category,
    } = req.body;

    // VALIDATION

    if (
      !name ||
      !description ||
      !price ||
      !stock
    ) {

      return res.status(400).json({

        success: false,

        message:
          "All Fields Are Required",

      });

    }

    // CHECK IMAGES

    if (
      !req.files ||
      req.files.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please Upload Product Images",

      });

    }

    // CLOUDINARY IMAGE URLS

    const imageUrls =
      req.files.map(
        (file) =>
          file.path
      );

    // CREATE PRODUCT

    const product =
      await Product.create({

        name,

        description,

        price,

        stock,

        category,

        images: imageUrls,

        // SELLER ID
        seller:
          req.user.id,

      });

    res.status(201).json({

      success: true,

      message:
        "Product Added Successfully",

      product,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed To Add Product",

    });

  }

};

// ======================================
// GET LOGGED IN SELLER PRODUCTS
// ======================================

export const getMyProducts = async (
  req,
  res
) => {

  try {

    const products =
      await Product.find({

        seller:
          req.user.id,

      }).sort({
        createdAt: -1,
      });

    res.status(200).json({

      success: true,

      products,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed To Fetch Products",

    });

  }

};

// ======================================
// GET ALL PRODUCTS
// ======================================

export const getAllProducts = async (
  req,
  res
) => {

  try {

    const products =
      await Product.find()

        .populate(
          "seller",
          "name email"
        )

        .sort({
          createdAt: -1,
        });

    res.status(200).json({

      success: true,

      count:
        products.length,

      products,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed To Fetch Products",

    });

  }

};

// ======================================
// DELETE PRODUCT
// ======================================

export const deleteProduct = async (
  req,
  res
) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      );

    // =========================
    // CHECK PRODUCT
    // =========================

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product not found",

      });

    }

    // =========================
    // VERIFY OWNER
    // =========================

    if (

      product.seller.toString() !==
      req.user.id

    ) {

      return res.status(403).json({

        success: false,

        message:
          "You are not authorized to delete this product",

      });

    }

    // =========================
    // DELETE PRODUCT
    // =========================

    await Product.findByIdAndDelete(
      req.params.id
    );

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({

      success: true,

      message:
        "Product deleted successfully",

      deletedProductId:
        req.params.id,

    });

  } catch (error) {

    console.log(
      "DELETE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Internal server error while deleting product",

    });

  }

};
// ======================================
// UPDATE PRODUCT
// ======================================

export const updateProduct = async (
  req,
  res
) => {

  try {

    const {
      name,
      description,
      price,
      stock,
      category,
    } = req.body;

    // =========================
    // FIND PRODUCT
    // =========================

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product Not Found",

      });

    }

    // =========================
    // CHECK OWNER
    // =========================

    if (
      product.seller.toString() !==
      req.user.id
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Unauthorized",

      });

    }

    // =========================
    // EXISTING IMAGES
    // =========================

    let existingImages = [];

    if (
      req.body.existingImages
    ) {

      existingImages =
        JSON.parse(
          req.body.existingImages
        );

    }

    // =========================
    // NEW CLOUDINARY IMAGES
    // =========================

    const newUploadedImages =
      req.files?.map(
        (file) => file.path
      ) || [];

    // =========================
    // FINAL IMAGES
    // =========================

    const finalImages = [

      ...existingImages,

      ...newUploadedImages,

    ];

    // =========================
    // UPDATE FIELDS
    // =========================

    product.name =
      name || product.name;

    product.description =
      description ||
      product.description;

    product.price =
      price || product.price;

    product.stock =
      stock || product.stock;

    product.category =
      category ||
      product.category;

    // =========================
    // UPDATE IMAGES
    // =========================

    product.images =
      finalImages;

    // =========================
    // SAVE PRODUCT
    // =========================

    await product.save();

    res.status(200).json({

      success: true,

      message:
        "Product Updated Successfully",

      product,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed To Update Product",

    });

  }

};

// ======================================
// GET SINGLE PRODUCT
// ======================================

export const getSingleProduct = async (
  req,
  res
) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      ).populate(
        "seller",
        "name email"
      );

    if (!product) {

      return res.status(404).json({

        success: false,

        message:
          "Product Not Found",

      });

    }

    res.status(200).json({

      success: true,

      product,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed To Fetch Product",

    });

  }

};