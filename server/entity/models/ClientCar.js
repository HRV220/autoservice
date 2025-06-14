import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class ClientCar extends Model {}
ClientCar.init(
  {
    carId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [8, 9],
        isAlphanumeric: true,
      },
    },
    vin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        validate: {
          len: [17, 17],
          isAlphanumeric: true,
        },
      },
    },
    yearRelease: { type: DataTypes.SMALLINT },
    bodyType: { type: DataTypes.STRING, allowNull: false },
    mileage: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    transmission: {
      type: DataTypes.ENUM("Автомат", "Робот", "Вариатор", "Механическая"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ClientCar",
    timestamps: true,
  }
);

export default ClientCar;
