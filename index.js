var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const multer = require("multer");

var user = require("./routes/user");
var hotel = require("./routes/hotel");
var category = require("./routes/category");
var booking = require("./routes/booking");
var app = express();
const helmet = require("helmet");
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrc: [
        "'self'",
        "mongodb+srv://sickboy13052001:sickboy13052001@cluster0.emjwsxi.mongodb.net/test",
      ],
    },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const url =
  "mongodb+srv://sickboy13052001:sickboy13052001@cluster0.emjwsxi.mongodb.net/test";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("kết nối thành công");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/user", user);
app.use("/api/hotel", hotel);
app.use("/api/category", category);
app.use("/api/booking", booking);
const port = 5000;

app.listen(port, () => {
  console.log(`listen at port ${port}`);
});
