import * as dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./src/app.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
// const MONGODB_URI = process.env.URL_DB;

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// запуск сервера
async function startServer() {
  try {
    app.listen(PORT);
    // app.listen(80);

    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.log(`Server not running. Error message: ${error.message}`);
    process.exit(1);
  }
}

// запускаем сервер и подключаемся к БД
async function startApp() {
  // await connectToDatabase();
  await startServer();
}

// стартуем приложение
startApp();
