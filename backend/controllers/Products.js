import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Product.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findAll({
        where: { userId: req.userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("🔥 ERROR getProducts:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    let response;
    if (req.role === "admin") {
      response = await Product.findOne({
        attributes: ["uuid", "name", "price", "image"],
        where: { id: product.id },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Product.findOne({
        attributes: ["uuid", "name", "price", "image"],
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name", "email"],
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ ERROR getProductById:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const image = req.file?.filename || null;

    if (!name || !price) {
      return res.status(400).json({ msg: "Nama dan harga wajib diisi" });
    }

    await Product.create({
      name,
      price,
      image,
      userId: req.userId,
    });

    res.status(201).json({ msg: "Produk berhasil ditambahkan" });
  } catch (error) {
    console.error("❌ ERROR createProduct:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    const { name, price } = req.body;
    const image = req.file?.filename || product.image;

    if (req.role === "admin") {
      await Product.update(
        { name, price, image },
        {
          where: { id: product.id },
        }
      );
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });

      await Product.update(
        { name, price, image },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }

    res.status(200).json({ msg: "Produk berhasil diupdate" });
  } catch (error) {
    console.error("❌ ERROR updateProduct:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

    if (req.role === "admin") {
      await Product.destroy({
        where: { id: product.id },
      });
    } else {
      if (req.userId !== product.userId)
        return res.status(403).json({ msg: "Akses terlarang" });

      await Product.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
    }

    res.status(200).json({ msg: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("❌ ERROR deleteProduct:", error.message);
    res.status(500).json({ msg: error.message });
  }
};
