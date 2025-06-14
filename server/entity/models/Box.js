import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class Box extends Model {}
Box.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    boxNumber: { type: DataTypes.INTEGER, allowNull: false },
    placeNumber: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Box",
    timestamps: false,
  }
);

export default Box;
