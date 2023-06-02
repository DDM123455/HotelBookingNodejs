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
  rooms: [
    {
      type: { type: String, required: true },
      price: { type: Number, required: true },
      available: { type: Boolean, required: true },
      image: { type: String },
      quantity: Number,
    },
  ],
  star: Number,
  toado1: String,
  toado2: String,
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
