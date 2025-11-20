export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.isJoi || err.details) {
    return res
      .status(400)
      .json({ status: 400, message: err.details ? err.details[0].message : err.message });
  }
  res
    .status(err.status || 500)
    .json({ status: err.status || 500, message: err.message || 'Something went wrong' });
};
