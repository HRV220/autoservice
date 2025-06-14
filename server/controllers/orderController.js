const {
  Order,
  Order_Service,
  Client,
  Employee,
  CarModel,
  ClientCar,
  Box,
  Service,
} = require("../entity/models/models");
const sequelize = require("../db");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");

class OrderController {
  async create(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const {
        clientId,
        employeeId,
        carId,
        createDate,
        completeDate,
        status,
        services,
        boxNumber,
        placeNumber,
      } = req.body;

      if (!clientId || !carId || !services || services.length === 0) {
        return next(
          ApiError.badRequest("Не указан клиент, автомобиль или список работ")
        );
      }

      const finalCreateDate = createDate ? new Date(createDate) : new Date();
      const finalCompleteDate = completeDate ? new Date(completeDate) : null;

      const serviceIds = services.map((s) => s.serviceId);
      const servicesFromDb = await Service.findAll({
        where: { serviceId: serviceIds },
        transaction: t,
      });

      if (servicesFromDb.length !== serviceIds.length) {
        return next(
          ApiError.badRequest(
            "Одна или несколько услуг не найдены в базе данных."
          )
        );
      }

      let totalPrice = 0;
      services.forEach((reqService) => {
        const dbService = servicesFromDb.find(
          (s) => s.serviceId === reqService.serviceId
        );
        const count = reqService.count || 1;
        totalPrice += parseFloat(dbService.price) * count;
      });
      console.log(`[ЛОГ] Рассчитана итоговая цена: ${totalPrice}`);

      let foundBoxId = null;
      if (boxNumber && placeNumber) {
        console.log(
          `[ЛОГ] Начинаем поиск бокса. Входящие данные: boxNumber='${boxNumber}' (тип: ${typeof boxNumber}), placeNumber='${placeNumber}' (тип: ${typeof placeNumber})`
        );

        const searchBoxNumber = parseInt(boxNumber, 10);
        const searchPlaceNumber = parseInt(placeNumber, 10);

        console.log(
          `[ЛОГ] Ищем в БД по: boxNumber=${searchBoxNumber} (тип: ${typeof searchBoxNumber}), placeNumber=${searchPlaceNumber} (тип: ${typeof searchPlaceNumber})`
        );

        const box = await Box.findOne({
          where: {
            boxNumber: searchBoxNumber,
            placeNumber: searchPlaceNumber,
          },
          transaction: t,
        });

        if (box) {
          foundBoxId = box.boxId;
          console.log(
            `[ЛОГ] УСПЕХ! Найден бокс: ${JSON.stringify(
              box,
              null,
              2
            )}. ID для сохранения: ${foundBoxId}`
          );
        } else {
          console.error(
            `[ОШИБКА ПОИСКА] Бокс с такими параметрами НЕ НАЙДЕН в базе данных.`
          );
        }
      } else {
        console.log(
          "[ЛОГ] boxNumber или placeNumber не были предоставлены. Заказ будет создан без бокса."
        );
      }

      console.log(
        `[ЛОГ] Попытка создать запись в Order с boxId: ${foundBoxId}`
      );
      const order = await Order.create(
        {
          clientId,
          employeeId: employeeId || null,
          carId,
          boxId: foundBoxId,
          price: totalPrice,
          createDate: finalCreateDate,
          completeDate: finalCompleteDate,
          status: status || "ожидает",
        },
        { transaction: t }
      );

      const orderServices = services.map((s) => ({
        orderId: order.orderId,
        serviceId: s.serviceId,
        count: s.count || 1,
      }));
      await Order_Service.bulkCreate(orderServices, { transaction: t });

      await t.commit();
      return res.json(order);
    } catch (e) {
      await t.rollback();
      console.error("--- ПРОИЗОШЛА ОШИБКА ПРИ СОЗДАНИИ ЗАКАЗА! ---", e);
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { date } = req.query;
      let whereCondition = {};

      if (date) {
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        whereCondition.createDate = {
          [Op.between]: [startOfDay, endOfDay],
        };
      }

      const orders = await Order.findAll({
        where: whereCondition,
        include: [
          {
            model: Client,
            attributes: ["firstName", "lastName"],
            required: false,
          },
          {
            model: Employee,
            attributes: ["firstName", "lastName"],
            required: false,
          },
          {
            model: ClientCar,
            attributes: ["stateNumber"],
            required: false,
            include: [
              {
                model: CarModel,
                attributes: ["brand", "model"],
                required: false,
              },
            ],
          },
          {
            model: Box,
            attributes: ["boxId", "boxNumber"],
            required: false,
          },
          {
            model: Service,
            attributes: ["nameService"],
            through: { attributes: [] },
            required: false,
          },
        ],
        order: [["createDate", "ASC"]],
      });

      return res.json(orders);
    } catch (e) {
      console.error("SERVER ERROR in getAll Orders:", e);
      next(ApiError.internal("Ошибка при получении списка заказов"));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        where: { orderId: id },
        include: [
          {
            model: Client,
            attributes: ["firstName", "lastName"],
          },
          {
            model: Employee,
            attributes: ["firstName", "lastName"],
          },
          {
            model: ClientCar,
            attributes: ["stateNumber"],
            include: [
              {
                model: CarModel,
                as: "CarModel",
                attributes: ["brand", "model"],
              },
            ],
          },
          {
            model: Box,
            attributes: ["boxNumber"],
          },
          {
            model: Service,
            attributes: ["serviceId", "nameService", "price"],
            through: { attributes: ["count"] },
          },
        ],
      });

      if (!order) {
        return next(ApiError.notFound("Заказ не найден"));
      }
      return res.json(order);
    } catch (e) {
      console.error("SERVER ERROR in getOne Order:", e);
      next(ApiError.internal("Ошибка при получении заказа: " + e.message));
    }
  }

  async update(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { status, employeeId, boxId, services } = req.body;

      const order = await Order.findOne({
        where: { orderId: id },
        transaction: t,
      });
      if (!order) {
        return next(ApiError.notFound("Заказ не найден для обновления"));
      }
      let totalPrice = order.price;
      if (services && Array.isArray(services)) {
        console.log("[ЛОГ UPDATE] Обновляем список услуг...");

        await Order_Service.destroy({ where: { orderId: id }, transaction: t });

        if (services.length > 0) {
          const orderServices = services.map((s) => ({
            orderId: id,
            serviceId: s.serviceId,
            count: s.count || 1,
          }));
          await Order_Service.bulkCreate(orderServices, { transaction: t });

          const serviceIds = services.map((s) => s.serviceId);
          const servicesFromDb = await Service.findAll({
            where: { serviceId: serviceIds },
            transaction: t,
          });

          totalPrice = 0;
          services.forEach((reqService) => {
            const dbService = servicesFromDb.find(
              (s) => s.serviceId === reqService.serviceId
            );
            if (dbService) {
              totalPrice +=
                parseFloat(dbService.price) * (reqService.count || 1);
            }
          });
          console.log(`[ЛОГ UPDATE] Новая рассчитанная цена: ${totalPrice}`);
        } else {
          totalPrice = 0;
        }
      }

      await order.update(
        {
          status,
          employeeId,
          boxId,
          price: totalPrice,
        },
        { transaction: t }
      );

      await t.commit();
      console.log(`[ЛОГ UPDATE] Заказ ${id} успешно обновлен.`);

      const updatedOrderWithIncludes = await Order.findOne({
        where: { orderId: id },
        include: [
          { model: Client, attributes: ["firstName", "lastName"] },
          { model: Employee, attributes: ["firstName", "lastName"] },
          {
            model: ClientCar,
            attributes: ["stateNumber"],
            include: [
              {
                model: CarModel,
                as: "CarModel",
                attributes: ["brand", "model"],
              },
            ],
          },
          { model: Box, attributes: ["boxNumber"] },
          {
            model: Service,
            attributes: ["serviceId", "nameService", "price"],
            through: { attributes: ["count"] },
          },
        ],
      });

      return res.json(updatedOrderWithIncludes);
    } catch (e) {
      await t.rollback();
      console.error("--- ОШИБКА ПРИ ОБНОВЛЕНИИ ЗАКАЗА! ---", e);
      next(ApiError.internal("Ошибка при обновлении заказа: " + e.message));
    }
  }

  async delete(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const order = await Order.findOne({
        where: { orderId: id },
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return next(ApiError.notFound("Заказ не найден"));
      }
      await Order_Service.destroy({
        where: { orderId: id },
        transaction: t,
      });

      await Order.destroy({
        where: { orderId: id },
        transaction: t,
      });

      await t.commit();
      return res.json({ message: `Заказ ${id} успешно удален.` });
    } catch (e) {
      await t.rollback();
      console.error("--- ОШИБКА ПРИ УДАЛЕНИИ ЗАКАЗА ---", e);
      next(ApiError.internal("Ошибка при удалении заказа: " + e.message));
    }
  }
}

module.exports = new OrderController();
