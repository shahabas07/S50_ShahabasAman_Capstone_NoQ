const express = require('express')
const app = express()
require("dotenv").config();
const port = process.env.PORT;
const connect = require("./config/connect");
const serviceRoute = require("./route/serviceRoute")
const profileRoute = require("./route/profileRoute")

connect()
app.get('/ping', (req,res) => {
    res.send('pong')
})
app.use(express.json());

app.use("/service", serviceRoute);
app.use("/profile", profileRoute);

app.listen(port, () => {
    console.log(`🚀 Server running on PORT: ${port}`);
  });

  module.exports = app;