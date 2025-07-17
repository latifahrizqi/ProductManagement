import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Products = db.define("product", {
  uuid: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    validate: { notEmpty: true }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true, len: [2, 100] }
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { notEmpty: true }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true
});


export default Products;
