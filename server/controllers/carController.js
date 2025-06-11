const uuid = require("uuid");
const path = require("path");
const { ClientCar, Engine, CarModel } = require("../entity/models/models"); // Добавили ClientCar и другие, если нужны для связей
const ApiError = require("../error/ApiError");
class CarController {
  async create(req, res, next) {
    try {
      const {
        stateNumber,
        vin,
        yearRealese,
        bodyType,
        mileage,
        transmission,
        ClientId,
        EngineEngineNumber,
        CarModelBrandModelId,
      } = req.body;
      const { img } = req.files;
      let filName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
      if (!stateNumber || !vin || !bodyType || !transmission || !ClientId) {
        return next(
          ApiError.badRequest(
            "Не указаны все обязательные поля: stateNumber, vin, bodyType, transmission, ClientId"
          )
        );
      }

      const clientCar = await ClientCar.create({
        stateNumber,
        vin,
        yearRealese,
        bodyType,
        mileage,
        transmission,
        ClientId,
        EngineEngineNumber,
        CarModelBrandModelId,
      });
      return res.json(clientCar);
    } catch (e) {
      next(ApiError.badRequest(e.message));
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
}

module.exports = new CarController();
