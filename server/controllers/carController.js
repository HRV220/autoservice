const uuid = require("uuid");
const path = require("path");
const { ClientCar, Engine, CarModel } = require("../entity/models/models");
const sequelize = require("../db");
const ApiError = require("../error/ApiError");

class CarController {
  async create(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const {
        stateNumber,
        vin,
        yearRelease,
        bodyType,
        mileage,
        transmission,
        clientId,
        engine,
        brand,
        model,
      } = req.body;

      if (
        !stateNumber ||
        !vin ||
        !clientId ||
        !engine ||
        !engine.engineNumber ||
        !brand ||
        !model
      ) {
        return next(
          ApiError.badRequest(
            "Не указаны все обязательные поля: госномер, VIN, ID клиента, данные двигателя, марка и модель."
          )
        );
      }

      const [engineInstance] = await Engine.findOrCreate({
        where: { engineNumber: engine.engineNumber },
        defaults: {
          type: engine.type || "Бензин",
          horsePower: engine.horsePower || 0,
          capacity: engine.capacity || 0,
        },
        transaction: t,
      });

      const [carModelInstance] = await CarModel.findOrCreate({
        where: { brand: brand, model: model },
        defaults: { brand, model },
        transaction: t,
      });

      const clientCar = await ClientCar.create(
        {
          stateNumber,
          vin,
          yearRelease,
          bodyType,
          mileage,
          transmission,
          clientId,
          engineNumber: engineInstance.engineNumber,
          brandModelId: carModelInstance.brandModelId,
        },
        { transaction: t }
      );

      await t.commit();
      return res.json(clientCar);
    } catch (e) {
      await t.rollback();
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(
          ApiError.badRequest(
            "Машина с таким госномером или VIN уже существует."
          )
        );
      }
      next(ApiError.internal("Ошибка при создании автомобиля: " + e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const cars = await ClientCar.findAll();
      return res.json(cars);
    } catch (e) {
      next(
        ApiError.internal(
          "Ошибка при получении списка автомобилей: " + e.message
        )
      );
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const carData = req.body;

      if (!id) {
        return next(ApiError.badRequest("Не указан ID автомобиля"));
      }

      delete carData.engineNumber;
      delete carData.brandModelId;

      const [updatedRowsCount] = await ClientCar.update(carData, {
        where: { carId: id },
      });

      if (updatedRowsCount > 0) {
        const updatedCar = await ClientCar.findOne({ where: { carId: id } });
        return res.json(updatedCar);
      }
      return next(ApiError.notFound("Автомобиль не найден для обновления"));
    } catch (e) {
      next(ApiError.internal("Ошибка при обновлении автомобиля: " + e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(ApiError.badRequest("Не указан ID автомобиля"));
      }

      const deletedRowsCount = await ClientCar.destroy({
        where: { carId: id },
      });

      if (deletedRowsCount > 0) {
        return res.json({ message: "Автомобиль успешно удален" });
      }
      return next(ApiError.notFound("Автомобиль не найден для удаления"));
    } catch (e) {
      next(ApiError.internal("Ошибка при удалении автомобиля: " + e.message));
    }
  }
}

module.exports = new CarController();
