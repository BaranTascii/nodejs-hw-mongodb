export const errorHandler = (err, req, res, next) => {
  if (err.isJoi || err.details) {
    return res.status(400).json({
      status: 400,
      message: err.details[0].message,
    });
  }

  const status = err.status || 500;

  res.status(status).json({
    status,
    message: err.message || 'Internal Server Error',
  });
};
