const sequelize = require("../../db");
const { DataTypes, DATE } = require("sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  login: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
});

const Box = sequelize.define("Box", {
  boxId: { type: DataTypes.INTEGER, primaryKey: true },
  boxNumber: { type: DataTypes.SMALLINT },
  placeNumber: { type: DataTypes.SMALLINT },
});

const ClientCar = sequelize.define("ClientCar", {
  carId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stateNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  vin: { type: DataTypes.STRING, allowNull: false, unique: true },
  yearRealese: { type: DataTypes.SMALLINT },
  bodyType: { type: DataTypes.STRING, allowNull: false },
  mileage: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  transmission: {
    type: DataTypes.ENUM("Автомат", "Робот", "Вариатор", "Механическая"),
    allowNull: false,
  },
});

const Client = sequelize.define("Client", {
  clientId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  middleName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false },
  createDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Employee = sequelize.define("Employee", {
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
});

const Engine = sequelize.define("Engine", {
  engineNumber: { type: DataTypes.STRING, primaryKey: true, allowNull: true },
  type: {
    type: DataTypes.ENUM("Бензин", "Дизель", "Электромотор"),
    allowNull: false,
  },
  horsePower: { type: DataTypes.INTEGER, allowNull: false },
  capacity: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
});

const Order = sequelize.define("Order", {
  OrderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  createDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  completeDate: { type: DataTypes.DATE, allowNull: true },
  status: {
    type: DataTypes.ENUM("ожидает", "в процессе", "выполнено"),
    allowNull: false,
  },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

const Service = sequelize.define("Service", {
  serviceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  nameService: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

const Specialization = sequelize.define("Specialization", {
  specializationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  specializationName: { type: DataTypes.STRING, allowNull: true, unique: true },
});

const CarModel = sequelize.define("CarModel", {
  brandModelId: { type: DataTypes.INTEGER, primaryKey: true },
  brand: { type: DataTypes.STRING },
  model: { type: DataTypes.STRING },
});

const Order_Service = sequelize.define("Order_Service", {
  count: { type: DataTypes.SMALLINT, allowNull: true },
});

Client.hasMany(ClientCar);
ClientCar.belongsTo(Client);

Client.hasMany(Order);
Order.belongsTo(Client);

Engine.hasMany(ClientCar);
ClientCar.belongsTo(Engine);

CarModel.hasMany(ClientCar);
ClientCar.belongsTo(CarModel);

ClientCar.hasMany(Order);
Order.belongsTo(ClientCar);

Box.hasMany(Order);
Order.belongsTo(Box);

Employee.hasMany(Order);
Order.belongsTo(Employee);

Employee.hasMany(Specialization);
Specialization.belongsTo(Employee);

Order.belongsToMany(Service, { through: Order_Service });
Service.belongsToMany(Order, { through: Order_Service });
