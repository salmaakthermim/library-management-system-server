import { Server } from "http";
import mongoose from "mongoose";
import { app } from "./app";

let server: Server;
const PORT = 5000;

async function Main() {
  try {
    await mongoose.connect(
      "mongodb+srv://todosAppDb:todosAppDb@cluster0.zkk0rbw.mongodb.net/Library-Management-System-Server?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB usuing Mongoose");
    server = app.listen(PORT, () => {
      console.log(
        `Library Management System Server is running on port ${PORT}`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

Main();
