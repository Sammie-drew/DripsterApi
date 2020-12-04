import mongoose from "mongoose";
import Joi from "joi";
import joiObjectid from "joi-objectid";
Joi.objectId = joiObjectid(Joi);
// import dotenv from "dotenv";

// dotenv.config();
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50,
  },
  desc: {
    type: String,
    required: true,
    minlength: 20,
  },
  size: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5,
  },
  designer: {
    type: mongoose.Types.ObjectId,
    ref: "Designers",
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
});

const productValidator = (product) => {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(50),
    desc: Joi.string().required().min(20),
    size: Joi.string().min(1).max(5).required(),
    designer: Joi.objectId().required(),
    rating: Joi.number().default(0).required(),
  });

  return schema.validate(product);
};

const Product = mongoose.model("Products", productSchema);

export { Product, productValidator };
