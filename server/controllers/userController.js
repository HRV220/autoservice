const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const { User } = require("../entity/models/models"); // Предполагая, что User экспортируется из models.js
const jwt = require("jsonwebtoken");

const generateJwt = (id, login) => {
  return jwt.sign(
    {
      id,
      login,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

class UserController {
  async registration(req, res, next) {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        return next(ApiError.badRequest("Некорректный логин или пароль"));
      }
      const candidate = await User.findOne({ where: { login } });
      if (candidate) {
        return next(
          ApiError.badRequest("Пользователь с таким логином уже существует")
        );
      }
      const hashPassword = await bcrypt.hash(password, 5);
      console.log("Создание пользователя");
      const user = await User.create({ login, passwordHash: hashPassword });
      const token = generateJwt(user.id, user.login);
      return res.json({ token });
    } catch (e) {
      next(ApiError.internal("Ошибка при регистрации: " + e.message));
    }
  }
  async login(req, res, next) {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login } });
    if (!user) {
      return next(ApiError.internal("Пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.passwordHash);
    if (!comparePassword) {
      return next(ApiError.internal("Неверный пароль"));
    }
    const token = generateJwt(user.id, user.login);
    return res.json({ token });
  }
  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.login);
    return res.json({ token });
  }
}

module.exports = new UserController();
