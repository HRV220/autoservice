const ApiError = require("../error/ApiError");

module.exports = function (err, req, res, next) {
  console.error("--- ОБРАБОТЧИК ОШИБОК ПОЙМАЛ ОШИБКУ ---");
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Непредвиденная ошибка на сервере!",

    errorDetails: {
      name: err.name,
      message: err.message,
      stack: err.stack,
      original: err.original,
    },
  });
};
