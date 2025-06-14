import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class CarModel extends Model {}
CarModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "CarModel",
    timestamps: false,
  }
);

export default CarModel;
