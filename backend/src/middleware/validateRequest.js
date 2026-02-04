const { ZodError } = require('zod');
const { AppError } = require('../utils/appError');

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        return next(new AppError('Validation failed', 400, errorMessages));
      }
      next(error);
    }
  };
};

module.exports = { validateRequest };
