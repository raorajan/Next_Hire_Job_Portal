const logger = require("../utils/logger");

const validate = (schema) => async (req, res, next) => {
  try {
    const parsedParams = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Replace req properties with validated (and potentially stripped/transformed) data
    req.body = parsedParams.body;
    req.query = parsedParams.query;
    req.params = parsedParams.params;
    
    return next();
  } catch (error) {
    logger.warn(`Validation Error: ${error.message}`);
    
    // Format Zod errors
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
};

module.exports = validate;
