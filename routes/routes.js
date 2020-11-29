import express from "express";

export default (app) => {
  const apiRoutes = express.Router();

  app.use(express.json());
  app.get("/", (req, res) => res.json("Welcome"));

  return app.use("/api", apiRoutes);
};
