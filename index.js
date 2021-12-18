const express = require("express");
// const request = require('request');
const mainroute = require('./route/paystackRouter');
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

//Parse Env Varriable
// dotenv.config({ path: "./config.env" });

//Initializing app
const app = express();

//Body parser
app.use(express.json());

//main api
app.use('/donation/api/v1/', mainroute);

//Connect to Database.....Here i'm using Local Db
mongoose
  .connect(process.env.DATABASE_CONNECTION_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("CONNECTED TO DATABASE"))
  .catch((err) => console.log("ERROR CONNECTING TO DATABASE", err));

//SEVER
const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => console.log(`Server Running on port ${port}`));
