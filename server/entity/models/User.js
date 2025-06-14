import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class User extends Model {}
User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    login: { type: DataTypes.STRING, unique: true, allowNull: false },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: false,
  }
);

export default User;
