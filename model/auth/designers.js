import mongoose from "mongoose";
import Joi from "joi";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const designerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    aka: {
      type: String,
      required: true,
      maxlength: 50,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      required: true,
      minlength: 20,
    },
    dob: {
      type: Date,
      required: true,
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

designerSchema.methods.generateAuthToken = function () {
  const token = Jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const designerValidator = (designer) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    aka: Joi.string().required().min(3).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(50).required(),
    picture: Joi.string(),
    dob: Joi.date().required(),
    bio: Joi.string().required().min(20),
  });
  return schema.validate(designer);
};

const Designer = mongoose.model("Designers", designerSchema);

export { Designer, designerValidator };
