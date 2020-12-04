import { User, userValidator } from "../model/auth/user.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import _ from "lodash";
import expressAsynceHandler from "express-async-handler";
import { Designer, designerValidator } from "../model/auth/designers.js";

export const getAllUsers = expressAsynceHandler(async (req, res) => {
  const users = await User.find({}).select("-password").select("-__v");
  const designers = await Designer.find({}).select("-password").select("-__v");

  res.status(200).json({
    message: "Users fetched",
    users,
    designers,
  });
});

export const registerUser = expressAsynceHandler(async (req, res) => {
  const { error } = userValidator(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
  });

  if (user) return res.status(400).json({ message: "User Already Exits" });

  user = new User(
    _.pick(req.body, ["firstName", "lastName", "email", "password", "isAdmin"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.header("authorization", token).json({
    message: "User Created",
    details: _.pick(user, [
      "_id",
      "firstName",
      "lastName",
      "email",
      "isAdmin",
      "createdAt",
    ]),
  });
});

export const registerDesigner = expressAsynceHandler(async (req, res) => {
  const { error } = designerValidator(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await Designer.findOne({
    email: req.body.email,
  });

  if (user) return res.status(400).json({ message: "Designer Already Exits" });

  user = new Designer(
    _.pick(req.body, [
      "fullName",
      "aka",
      "email",
      "password",
      "bio",
      "dob",
      "picture",
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();

  res.header("authorization", token).json({
    message: "User Created",
    details: _.pick(user, [
      "_id",
      "fullName",
      "aka",
      "email",
      "password",
      "bio",
      "dob",
      "picture",
      "createdAt",
    ]),
  });
});

export const loginUser = expressAsynceHandler(async (req, res) => {
  const { error } = loginValidator(req.body);

  if (error)
    return res.status(200).json({
      message: "error validating request",
      error: error.details[0].message,
    });

  let user = await User.findOne({
    email: req.body.email,
  });

  if (!user)
    return res.status(400).json({
      message: "User Does not exist",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).json({
      message: "Invalid email or password",
    });

  const token = user.generateAuthToken();

  res.status(200).json({
    message: "Login Successful",
    token,
  });
});

export const loginDesigner = expressAsynceHandler(async (req, res) => {
  const { error } = loginValidator(req.body);

  if (error)
    return res.status(200).json({
      message: "error validating request",
      error: error.details[0].message,
    });

  let user = await Designer.findOne({
    email: req.body.email,
  });

  if (!user)
    return res.status(400).json({
      message: "Designer Does not exist",
    });

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).json({
      message: "Invalid email or password",
    });

  const token = user.generateAuthToken();

  res.status(200).json({
    message: "Login Successful",
    token,
  });
});

const loginValidator = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required().max(255).min(5),
    password: Joi.string().required().min(5).max(1024),
  });
  return schema.validate(user);
};
