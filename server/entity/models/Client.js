import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class Client extends Model {}
Client.init(
  {
    clientId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isNumeric: true },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isAlpha: true },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isAlpha: true },
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isAlpha: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    createdDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createdDate",
    },
  },
  {
    sequelize,
    modelName: "Client",
    timestamps: false,
  }
);

export default Client;
