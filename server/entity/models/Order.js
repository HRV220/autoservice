import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class Order extends Model {}
Order.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    completeDate: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM("ожидает", "в процессе", "выполнено"),
      allowNull: false,
    },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    sequelize,
    modelName: "Order",
    timestamps: false,
  }
);

export default Order;
