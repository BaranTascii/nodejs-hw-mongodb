export const errorHandler = (err, req, res, next) => {
  const status = err.status || 400;

  res.status(status).json({
    status: status,
    message: err.message || "Bad Request",
  });
};
