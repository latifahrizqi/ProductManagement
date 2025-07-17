import Users from "./UserModel.js";
import Products from "./ProductModel.js";

// Definisikan relasi di sini
Users.hasMany(Products, { foreignKey: "userId" });
Products.belongsTo(Users, { foreignKey: "userId", as: "user" });
