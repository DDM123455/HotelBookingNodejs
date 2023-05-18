const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String, required: true },
  price_range: { type: String, required: true },
  rating: { type: Number },
  amenities: { type: String },
  nearby_attractions: { type: String },
  rooms: [],
  star: Number,
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
