const validate = (schema) => {

  return (req, res, next) => {

    const { error } = schema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (error) {

      const errors = error.details.map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });

    }

    next();

  };

};

export default validate;