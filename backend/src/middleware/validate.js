const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    const issues = error.issues || error.errors;
    if (issues && Array.isArray(issues) && issues.length > 0) {
      const errorMessage = issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return next(new AppError(400, errorMessage));
    }
    next(new AppError(400, 'Invalid request payload'));
  }
};

module.exports = validate;
