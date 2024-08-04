const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors"); // Import the cors package
const port = process.env.PORT;
const connect = require("./config/connect");
const serviceRoute = require("./route/serviceRoute");
const profileRoute = require("./route/profileRoute");
const appointmentRoute = require("./route/appointmentRoute");
const sectionRoute = require("./route/sectionRoute");
const reviewRoute = require("./route/reviewRoute");


app.use(cors()); // Enable CORS for all routes
app.use(express.json());

connect();
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/service", serviceRoute);
app.use("/profile", profileRoute);
app.use("/appointment", appointmentRoute);
app.use("/section", sectionRoute);
app.use("/review", reviewRoute);

app.listen(port, () => {
  console.log(`🚀 Server running on PORT: ${port}`);
});

module.exports = app;
