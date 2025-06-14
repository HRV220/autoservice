import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class Employee extends Model {}

Employee.init(
  {
    employeeId: {
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
    salary: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    experience: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "Employee",
  }
);

export default Employee;
