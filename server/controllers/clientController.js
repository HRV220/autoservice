const { Client, ClientCar, CarModel } = require("../entity/models/models");
const ApiError = require("../error/ApiError");

class ClientController {
  async create(req, res, next) {
    try {
      const { firstName, lastName, middleName, phoneNumber, email } = req.body;

      if (!firstName || !lastName || !phoneNumber) {
        return next(
          ApiError.badRequest(
            "Не указаны обязательные поля: Имя, Фамилия, Телефон"
          )
        );
      }

      const client = await Client.create({
        firstName,
        lastName,
        middleName,
        phoneNumber,
        email,
      });

      return res.json(client);
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return next(
          ApiError.badRequest(
            "Клиент с таким телефоном или email уже существует."
          )
        );
      }
      next(ApiError.internal("Ошибка при создании клиента: " + e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const clients = await Client.findAll({
        include: [
          {
            model: ClientCar,
            as: "ClientCars",
            attributes: ["carId", "stateNumber"],
            include: [
              {
                model: CarModel,
                as: "CarModel",
                attributes: ["brand", "model"],
              },
            ],
          },
        ],
        order: [["createdDate", "DESC"]],
      });

      const formattedClients = clients.map((client) => {
        return {
          id: client.clientId,
          name: `${client.lastName} ${client.firstName} ${
            client.middleName || ""
          }`.trim(),
          phone: client.phoneNumber,
          email: client.email,
          cars: client.ClientCars.map((car) => {
            const brand = car.CarModel
              ? car.CarModel.brand
              : "Марка не указана";
            const model = car.CarModel
              ? car.CarModel.model
              : "Модель не указана";
            return {
              carId: car.carId,
              model: `${brand} ${model}`.trim(),
              plate: car.stateNumber,
            };
          }),
        };
      });

      return res.json(formattedClients);
    } catch (e) {
      next(
        ApiError.internal("Ошибка при получении списка клиентов: " + e.message)
      );
    }
  }

  // ============== НОВЫЙ МЕТОД ==============
  async getOne(req, res, next) {
    try {
      const { id } = req.params; // Получаем id из параметров URL
      if (!id) {
        return next(ApiError.badRequest("Не указан ID клиента"));
      }

      const client = await Client.findOne({
        where: { clientId: id },
        // Включаем те же самые связанные данные, что и в getAll
        include: [
          {
            model: ClientCar,
            as: "ClientCars",
            include: [
              {
                model: CarModel,
                as: "CarModel",
              },
            ],
          },
        ],
      });

      if (!client) {
        return next(ApiError.notFound("Клиент с таким ID не найден"));
      }

      // Мы не будем форматировать данные здесь,
      // чтобы фронтенд получил полную информацию для детальной страницы
      return res.json(client);
    } catch (e) {
      next(
        ApiError.internal("Ошибка при получении данных клиента: " + e.message)
      );
    }
  }
}

module.exports = new ClientController();
