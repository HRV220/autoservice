import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class Service extends Model {}
Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isAlpha: true },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  },
  {
    sequelize,
    modelName: "Service",
    timestamps: true,
  }
);

export default Service;
