import jwt from "jsonwebtoken";

const protect = async (
  req,
  res,
  next
) => {

  try {

    let token;

    // =====================================
    // CHECK AUTH HEADER
    // =====================================

    if (

      req.headers.authorization &&

      req.headers.authorization.startsWith(
        "Bearer"
      )

    ) {

      // GET TOKEN
      token =
        req.headers.authorization.split(
          " "
        )[1];

    }

    // =====================================
    // NO TOKEN
    // =====================================

    if (!token) {

      return res.status(401).json({

        success: false,

        message: "Not Authorized, No Token",

      });

    }

    // =====================================
    // VERIFY TOKEN
    // =====================================

    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET

      );

    // SAVE USER DATA
    req.user = decoded;

    next();

  } catch (error) {

    console.log(
      "JWT ERROR:",
      error.message
    );

    return res.status(401).json({

      success: false,

      message: "Invalid Token",

    });

  }

};

export default protect;