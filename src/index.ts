const express = require("express");
const connectDB = require("./database");
const { PORT } = require("./config");
const App = require("./expressApp");

const startApp = async () => {
  await connectDB();

  const app = express();

  App(app);

  app.listen(PORT, () => {
    console.log(`application running on ${PORT}`);
  });
};

startApp();
