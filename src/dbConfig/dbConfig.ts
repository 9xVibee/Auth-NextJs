import mongoose from "mongoose";

export async function connectDb() {
  try {
    mongoose.connect(process.env.MONGO_URL!);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Database connected");
    });

    connection.on("error", (err) => {
      console.log(
        "Mongodb connection error please make sure db is up and running"
      );

      console.log(err);
      process.exit();
    });
  } catch (error) {
    console.log("error in dbconnect", error);
  }
}
