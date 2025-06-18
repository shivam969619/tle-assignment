// File: middleware/errorHandler.js
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? null : err.stack });
};

module.exports = { notFound, errorHandler };