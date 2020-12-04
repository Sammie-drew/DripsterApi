import cors from "cors";
import express from "express";
import db from "./middlewares/db.js";
import routes from "./routes/routes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

routes(app);
db();

const PORT = process.env.PORT || 6060;

app.listen(PORT, () => console.log(`Listenning at PORT::${PORT}`));
