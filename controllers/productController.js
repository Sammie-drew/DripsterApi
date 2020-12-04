import expressAsyncHandler from "express-async-handler";
import { Designer } from "../model/auth/designers.js";
import { Product, productValidator } from "../model/products/products.js";

export const getProduct = expressAsyncHandler(async (req, res) => {
  const products = await Product.find({}).populate(
    "designer",
    "aka email -_id"
  );

  res.status(200).json({ products });
});

export const createProduct = expressAsyncHandler(async (req, res) => {
  const { error } = productValidator(req.body);

  if (error) return res.status(400).json(error.details[0].message);

  const designer = await Designer.findById(req.body.designer);

  if (!designer) return res.status(400).json("designer not found");

  const name = await Product.findOne({ name: req.body.name });

  if (name)
    return res.status(400).json({
      message: "Error , Product already exists",
    });

  let product = new Product({
    name: req.body.name,
    desc: req.body.desc,
    size: req.body.size,
    designer: req.body.designer,
    rating: req.body.rating,
  });

  product = await product.save();

  res.status(201).json({
    message: "Product Created",
    product,
  });
});
