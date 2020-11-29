import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default () =>
  mongoose.connect(
    process.env.MONGODB_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
    () => console.log(`connected to db at${process.env.MONGODB_URL}`)
  );
