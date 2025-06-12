const { Employee, Specialization } = require("../entity/models/models");
const ApiError = require("../error/ApiError");

class EmployeeController {
  // === CREATE ===
  async create(req, res, next) {
    try {
      // Предполагаем, что специализации приходят как массив строк
      const {
        firstName,
        lastName,
        middleName,
        phoneNumber,
        salary,
        experience,
        specializations,
      } = req.body;

      if (!firstName || !lastName || !phoneNumber || !salary || !experience) {
        return next(ApiError.badRequest("Не указаны все обязательные поля"));
      }

      const employee = await Employee.create({
        firstName,
        lastName,
        middleName,
        phoneNumber,
        salary,
        experience,
      });

      // Если переданы специализации, создаем их и привязываем
      if (
        specializations &&
        Array.isArray(specializations) &&
        specializations.length > 0
      ) {
        const specs = specializations.map((specName) => ({
          specializationName: specName,
          employeeId: employee.employeeId,
        }));
        await Specialization.bulkCreate(specs);
      }

      return res.json(employee);
    } catch (e) {
      next(ApiError.internal("Ошибка при создании сотрудника: " + e.message));
    }
  }

  // === READ ALL ===
  async getAll(req, res, next) {
    try {
      const employees = await Employee.findAll({
        include: [
          {
            model: Specialization,
            as: "Specializations", // Убедитесь, что alias в модели 'Specializations'
            attributes: ["specializationName"],
          },
        ],
        order: [["lastName", "ASC"]],
      });
      return res.json(employees);
    } catch (e) {
      next(
        ApiError.internal(
          "Ошибка при получении списка сотрудников: " + e.message
        )
      );
    }
  }

  // === READ ONE ===
  async getOne(req, res, next) {
    // Логика для детальной страницы сотрудника (пока не нужна, но сделаем заготовку)
    try {
      const { id } = req.params;
      const employee = await Employee.findOne({
        where: { employeeId: id },
        include: [{ model: Specialization, as: "Specializations" }],
      });
      if (!employee) return next(ApiError.notFound("Сотрудник не найден"));
      return res.json(employee);
    } catch (e) {
      next(
        ApiError.internal(
          "Ошибка при получении данных сотрудника: " + e.message
        )
      );
    }
  }

  // === UPDATE ===
  async update(req, res, next) {
    // Логика обновления, включая специализации
    // Для простоты пока оставим базовую версию
    try {
      const { id } = req.params;
      const data = req.body;
      const [updated] = await Employee.update(data, {
        where: { employeeId: id },
      });
      if (!updated) return next(ApiError.notFound("Сотрудник не найден"));
      const updatedEmployee = await Employee.findOne({
        where: { employeeId: id },
      });
      return res.json(updatedEmployee);
    } catch (e) {
      next(ApiError.internal("Ошибка при обновлении сотрудника: " + e.message));
    }
  }

  // === DELETE ===
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      // Sequelize автоматически удалит связанные специализации благодаря onDelete: 'CASCADE'
      const deleted = await Employee.destroy({ where: { employeeId: id } });
      if (!deleted) return next(ApiError.notFound("Сотрудник не найден"));
      return res.json({ message: "Сотрудник успешно удален" });
    } catch (e) {
      next(ApiError.internal("Ошибка при удалении сотрудника: " + e.message));
    }
  }
}

module.exports = new EmployeeController();
