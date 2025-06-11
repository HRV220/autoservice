const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

// Модель User остается без изменений, если ее таблица называется "Users" или вы используете freezeTableName: true
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    login: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  }, // Предполагая, что таблица называется 'User', если не 'Users'
  { tableName: "User", timestamps: false }
);

const Box = sequelize.define(
  "Box",
  {
    boxId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    boxNumber: { type: DataTypes.SMALLINT },
    placeNumber: { type: DataTypes.SMALLINT },
  },
  { tableName: "Box", timestamps: false }
);

const ClientCar = sequelize.define(
  "ClientCar",
  {
    carId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stateNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    vin: { type: DataTypes.STRING, allowNull: false, unique: true },
    yearRelease: { type: DataTypes.SMALLINT }, // Исправлено: yearRealese -> yearRelease
    bodyType: { type: DataTypes.STRING, allowNull: false },
    mileage: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    transmission: {
      type: DataTypes.ENUM("Автомат", "Робот", "Вариатор", "Механическая"),
      allowNull: false,
    },
  },
  { tableName: "ClientCar", timestamps: false }
);

const Client = sequelize.define(
  "Client",
  {
    clientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: true }, // В DDL email может быть NULL
    createdDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createdDate",
    }, // Явно указываем имя поля, если оно отличается от createdAt
  },
  { tableName: "Client", timestamps: false } // У Client есть createdDate, но нет updatedAt. Если нужен только createdDate, то timestamps: false и управляем createdDate вручную или через field. Либо timestamps: true, но тогда нужно добавить updatedAt в БД или указать `updatedAt: false`
);

const Employee = sequelize.define(
  "Employee",
  {
    employeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING },
    salary: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    experience: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "Employee", timestamps: false }
);

const Engine = sequelize.define(
  "Engine",
  {
    engineNumber: { type: DataTypes.STRING, primaryKey: true, allowNull: true },
    type: {
      type: DataTypes.ENUM("Бензин", "Дизель", "Электромотор"),
      allowNull: false,
    },
    horsePower: { type: DataTypes.INTEGER, allowNull: false },
    capacity: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
  },
  { tableName: "Engine", timestamps: false }
);

const Order = sequelize.define(
  "Order",
  {
    orderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    createDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createDate",
    }, // Явно указываем имя поля
    completeDate: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("ожидает", "в процессе", "выполнено"),
      allowNull: false,
    },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: "Order", timestamps: false } // У Order есть createDate, но нет updatedAt.
);

const Service = sequelize.define(
  "Service",
  {
    serviceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    nameService: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: "Service", timestamps: false }
);

const Specialization = sequelize.define(
  "Specialization",
  {
    specializationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    specializationName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "Specialization", timestamps: false }
);

const CarModel = sequelize.define(
  "CarModel",
  {
    brandModelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: { type: DataTypes.STRING },
    model: { type: DataTypes.STRING },
  },
  { tableName: "CarModel", timestamps: false }
);

const Order_Service = sequelize.define(
  "Order_Service",
  {
    // Sequelize автоматически добавит orderId и serviceId как внешние ключи
    count: { type: DataTypes.SMALLINT, allowNull: true, defaultValue: 1 }, // Добавлено defaultValue: 1
  },
  { tableName: "Order_Service", timestamps: false }
);

// Ассоциации с указанием внешних ключей и правил ON UPDATE/DELETE согласно DDL

// Client <-> ClientCar
Client.hasMany(ClientCar, { foreignKey: "clientId" });
ClientCar.belongsTo(Client, {
  foreignKey: "clientId",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

// Client <-> Order
Client.hasMany(Order, { foreignKey: "clientId" });
Order.belongsTo(Client, {
  foreignKey: "clientId",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

// Engine <-> ClientCar
// В DDL Engine.hasMany(ClientCar) не определено явно, но ClientCar.belongsTo(Engine) есть.
// Sequelize требует двусторонней связи для hasMany/belongsTo, если вы их обе определяете.
// Если вам не нужна навигация от Engine к ClientCar, можно оставить только belongsTo.
Engine.hasMany(ClientCar, { foreignKey: "engineNumber" }); // Если нужна навигация от Engine
ClientCar.belongsTo(Engine, {
  foreignKey: "engineNumber",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

// CarModel <-> ClientCar
CarModel.hasMany(ClientCar, { foreignKey: "brandModelId" });
ClientCar.belongsTo(CarModel, {
  foreignKey: "brandModelId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// ClientCar <-> Order
ClientCar.hasMany(Order, { foreignKey: "carId" });
Order.belongsTo(ClientCar, {
  foreignKey: "carId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// Box <-> Order
Box.hasMany(Order, { foreignKey: "boxId" });
Order.belongsTo(Box, {
  foreignKey: "boxId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// Employee <-> Order
Employee.hasMany(Order, { foreignKey: "employeeId" });
Order.belongsTo(Employee, {
  foreignKey: "employeeId",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

// Employee <-> Specialization
// В DDL Specialization.belongsTo(Employee) (FK "employeeId" в "Specialization")
Employee.hasMany(Specialization, { foreignKey: "employeeId" });
Specialization.belongsTo(Employee, {
  foreignKey: "employeeId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// Order <-> Service (Many-to-Many)
Order.belongsToMany(Service, {
  through: Order_Service,
  foreignKey: "orderId", // FK в Order_Service, ссылающийся на Order
  otherKey: "serviceId", // FK в Order_Service, ссылающийся на Service
  onUpdate: "CASCADE",
  onDelete: "CASCADE", // Для связи Order -> Order_Service
});
Service.belongsToMany(Order, {
  through: Order_Service,
  foreignKey: "serviceId", // FK в Order_Service, ссылающийся на Service
  otherKey: "orderId", // FK в Order_Service, ссылающийся на Order
  onUpdate: "CASCADE",
  onDelete: "RESTRICT", // Для связи Service -> Order_Service
});

module.exports = {
  User,
  Box,
  ClientCar,
  Client,
  Employee,
  Engine,
  Order,
  Service,
  Specialization,
  CarModel,
  Order_Service,
};
