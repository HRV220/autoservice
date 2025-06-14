const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

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
  },
  { tableName: "User", timestamps: false }
);

const Box = sequelize.define(
  "Box",
  {
    boxNumber: { type: DataTypes.SMALLINT },
    placeNumber: { type: DataTypes.SMALLINT },
    boxId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    yearRelease: { type: DataTypes.SMALLINT },
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
    email: { type: DataTypes.STRING, allowNull: true },
    createdDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createdDate",
    },
  },
  { tableName: "Client", timestamps: false }
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
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    createDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createDate",
    },
    completeDate: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("ожидает", "в процессе", "выполнено"),
      allowNull: false,
    },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  { tableName: "Order", timestamps: false }
);

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
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
    count: { type: DataTypes.SMALLINT, allowNull: true, defaultValue: 1 },
  },
  { tableName: "Order_Service", timestamps: false }
);

Client.hasMany(ClientCar, { foreignKey: "clientId" });
ClientCar.belongsTo(Client, {
  foreignKey: "clientId",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Client.hasMany(Order, { foreignKey: "clientId" });
Order.belongsTo(Client, {
  foreignKey: "clientId",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

Engine.hasMany(ClientCar, { foreignKey: "engineNumber" });
ClientCar.belongsTo(Engine, {
  foreignKey: "engineNumber",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

CarModel.hasMany(ClientCar, { foreignKey: "brandModelId" });
ClientCar.belongsTo(CarModel, {
  foreignKey: "brandModelId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

ClientCar.hasMany(Order, { foreignKey: "carId" });
Order.belongsTo(ClientCar, {
  foreignKey: "carId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Box.hasMany(Order, { foreignKey: "boxId" });
Order.belongsTo(Box, {
  foreignKey: "boxId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Employee.hasMany(Order, { foreignKey: "employeeId" });
Order.belongsTo(Employee, {
  foreignKey: "employeeId",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

Employee.hasMany(Specialization, { foreignKey: "employeeId" });
Specialization.belongsTo(Employee, {
  foreignKey: "employeeId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

Order.belongsToMany(Service, {
  through: Order_Service,
  foreignKey: "orderId",
  otherKey: "serviceId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});
Service.belongsToMany(Order, {
  through: Order_Service,
  foreignKey: "serviceId",
  otherKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
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
