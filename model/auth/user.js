import mongoose from "mongoose";
import Joi from "joi";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      maxlength: 50,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  const token = Jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      email: this.email,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const userValidator = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
};

const User = mongoose.model("Users", userSchema);

export { User, userValidator };
