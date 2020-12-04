import express from "express";
import {
  registerUser,
  registerDesigner,
  getAllUsers,
  loginUser,
  loginDesigner,
} from "../controllers/accountController.js";
import { createProduct, getProduct } from "../controllers/productController.js";

export default (app) => {
  const apiRoutes = express.Router();
  const authRoutes = express.Router();
  const productRoutes = express.Router();

  apiRoutes.use("/accounts", authRoutes);
  apiRoutes.use("/products", productRoutes);
  // apiRoutes.use("/products");
  app.use(express.json());

  // Authentication routes
  authRoutes.get("/users", getAllUsers);
  authRoutes.post("/register/u", registerUser);
  authRoutes.post("/register/d", registerDesigner);
  authRoutes.post("/login/u", loginUser);
  authRoutes.post("/login/d", loginDesigner);

  // Products Routes

  productRoutes.get("/", getProduct);
  productRoutes.post("/", createProduct);

  app.get("/", (req, res) => res.json("Welcome"));

  return app.use("/api", apiRoutes);
};
