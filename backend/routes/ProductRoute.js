import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/Products.js";
import { verifyUser } from "../middleware/AuthUser.js";
import upload from "../middleware/Upload.js"; 

const router = express.Router();

router.get('/products', verifyUser, getProducts);
router.get('/products/:id', verifyUser, getProductById);
router.post('/products', verifyUser, upload.single("image"), createProduct); // ✅ hanya ini
router.patch('/products/:id', verifyUser, upload.single("image"), updateProduct);
router.delete('/products/:id', verifyUser, deleteProduct);

export default router;
