import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class Engine extends Model {}
Engine.init(
  {
    engineNumber: { type: DataTypes.STRING, primaryKey: true },
    type: {
      type: DataTypes.ENUM("Бензин", "Дизель", "Электромотор"),
      allowNull: false,
    },
    horsePower: { type: DataTypes.INTEGER, allowNull: false },
    capacity: { type: DataTypes.DECIMAL(3, 1), allowNull: false },
  },
  {
    sequelize,
    modelName: "Engine",
    timestamps: false,
  }
);

export default Engine;
