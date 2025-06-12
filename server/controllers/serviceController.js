const { Service } = require("../entity/models/models");
const ApiError = require("../error/ApiError");

class ServiceController {
  // === CREATE: Создание новой услуги ===
  async create(req, res, next) {
    try {
      const { nameService, description, price } = req.body;
      if (!nameService || !price) {
        return next(
          ApiError.badRequest(
            "Не указаны обязательные поля: Название услуги и Цена"
          )
        );
      }
      const service = await Service.create({ nameService, description, price });
      return res.json(service);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(
          ApiError.badRequest("Услуга с таким названием уже существует.")
        );
      }
      next(ApiError.internal("Ошибка при создании услуги: " + e.message));
    }
  }

  // === READ: Получение всех услуг ===
  async getAll(req, res, next) {
    try {
      const services = await Service.findAll({
        order: [["nameService", "ASC"]], // Сортируем по названию в алфавитном порядке
      });
      return res.json(services);
    } catch (e) {
      next(
        ApiError.internal("Ошибка при получении списка услуг: " + e.message)
      );
    }
  }

  // === READ: Получение одной услуги по ID ===
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const service = await Service.findOne({ where: { serviceId: id } });
      if (!service) {
        return next(ApiError.notFound("Услуга не найдена"));
      }
      return res.json(service);
    } catch (e) {
      next(ApiError.internal("Ошибка при получении услуги: " + e.message));
    }
  }

  // === UPDATE: Обновление услуги ===
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nameService, description, price } = req.body;

      const [updatedRowsCount] = await Service.update(
        { nameService, description, price },
        { where: { serviceId: id } }
      );

      if (updatedRowsCount > 0) {
        const updatedService = await Service.findOne({
          where: { serviceId: id },
        });
        return res.json(updatedService);
      }
      return next(ApiError.notFound("Услуга не найдена для обновления"));
    } catch (e) {
      next(ApiError.internal("Ошибка при обновлении услуги: " + e.message));
    }
  }

  // === DELETE: Удаление услуги ===
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedRowsCount = await Service.destroy({
        where: { serviceId: id },
      });
      if (deletedRowsCount > 0) {
        return res.json({ message: "Услуга успешно удалена" });
      }
      return next(ApiError.notFound("Услуга не найдена для удаления"));
    } catch (e) {
      next(ApiError.internal("Ошибка при удалении услуги: " + e.message));
    }
  }
}

module.exports = new ServiceController();
