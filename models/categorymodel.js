const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    name: String,
    star: Number,
  },
  { versionKey: false, collection: "category" }
);

module.exports = mongoose.model("Category", CategorySchema);
