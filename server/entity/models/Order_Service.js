import sequelize from "../../db";
import { DataTypes, Model } from "sequelize";

class Order_Service extends Model {}
Order_Service.init(
  {
    count: { type: DataTypes.SMALLINT, allowNull: true },
  },
  {
    sequelize,
    modelName: "Order_Service",
    timestamps: false,
  }
);

export default Order_Service;
