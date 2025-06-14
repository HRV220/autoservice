import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class Specialization extends Model {}
Specialization.init(
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
      validate: {
        isAlpha: true,
      },
    },
  },
  {
    sequelize,
    modelName: "Specialization",
    timestamps: false,
  }
);

export default Specialization;
