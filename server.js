import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import db from "./middlewares/db.js";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
db();
routes(app);

const PORT = process.env.PORT || 6060;

app.listen(PORT, () => console.log(`Listenning at PORT::${PORT}`));
