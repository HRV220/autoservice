const {
  Order,
  Client,
  Employee,
  ClientCar,
  CarModel,
  Box,
  Service,
} = require("../entity/models/models");
const { Op } = require("sequelize"); // Op используется для сложных запросов, например "между датами"
const ApiError = require("../error/ApiError");

class OrderController {
  // Метод для создания заказа пока оставим пустым
  async create(req, res, next) {
    // Логику создания заказа, которая будет очень сложной, мы реализуем позже.
    return res.json({
      message: "Метод создания заказа будет реализован позже",
    });
  }

  // Метод для получения всех заказов (с фильтрацией по дате)
  async getAll(req, res, next) {
    try {
      // Получаем дату из query-параметров. Если она не передана, то не фильтруем.
      const { date } = req.query;
      let whereCondition = {}; // Условие для запроса

      if (date) {
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        // Добавляем условие для поиска заказов в пределах одного дня
        // Мы будем искать по createDate, но в будущем это может быть плановая дата начала
        whereCondition.createDate = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }

      const orders = await Order.findAll({
        where: whereCondition,
        // Это самый важный блок. Он "подтягивает" связанные данные.
        include: [
          { model: Client, attributes: ["firstName", "lastName"] },
          { model: Employee, attributes: ["firstName", "lastName"] },
          {
            model: ClientCar,
            attributes: ["stateNumber"],
            include: [{ model: CarModel, attributes: ["brand", "model"] }],
          },
          { model: Box, attributes: ["boxId", "boxNumber"] },
          {
            model: Service,
            attributes: ["nameService"],
            through: { attributes: [] }, // Не включаем данные из промежуточной таблицы
          },
        ],
        order: [["createDate", "ASC"]], // Сортируем по времени создания
      });

      return res.json(orders);
    } catch (e) {
      next(
        ApiError.internal("Ошибка при получении списка заказов: " + e.message)
      );
    }
  }
}

module.exports = new OrderController();
