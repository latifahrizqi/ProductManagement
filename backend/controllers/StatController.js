import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import { Sequelize } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProducts = await Product.count();

    const productsByUser = await Product.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("product.id")), "productCount"],
        [Sequelize.col("user.name"), "name"]
      ],
      include: [
        {
          model: User,
          as: "user", // ⬅️ match alias in belongsTo
          attributes: []
        }
      ],
      group: ["user.name"],
      raw: true
    });

    res.json({
      totalUsers,
      totalProducts,
      productsByUser
    });
  } catch (error) {
    console.error("🔥 STAT ERROR:", error);
    res.status(500).json({ msg: error.message });
  }
};
