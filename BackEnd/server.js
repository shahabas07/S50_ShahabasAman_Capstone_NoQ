const express = require('express')
const app = express()
require("dotenv").config();
const port = process.env.PORT;
const connect = require("./connect");

connect()
app.get('/ping', (req,res) => {
    res.send('pong')
})
app.use(express.json());

app.listen(port, () => {
    console.log(`🚀 Server running on PORT: ${port}`);
  });

  module.exports = app;