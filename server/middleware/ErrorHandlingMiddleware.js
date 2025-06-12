const ApiError = require("../error/ApiError");

module.exports = function (err, req, res, next) {
  console.error("--- ОБРАБОТЧИК ОШИБОК ПОЙМАЛ ОШИБКУ ---");
  console.error(err); // Логируем полную ошибку в консоль сервера

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      // В режиме разработки можно добавить и другие поля, если они есть
      // errors: err.errors
    });
  }

  // Для всех остальных, непредвиденных ошибок
  return res.status(500).json({
    message: "Непредвиденная ошибка на сервере!",
    // ВАЖНО: В режиме разработки отправляем детали ошибки на фронтенд для отладки
    // В продакшене эту строку нужно будет закомментировать или убрать!
    errorDetails: {
      name: err.name,
      message: err.message,
      stack: err.stack, // Стек вызовов
      original: err.original, // Оригинальная ошибка от Sequelize
    },
  });
};
