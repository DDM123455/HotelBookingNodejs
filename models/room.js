const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  available: { type: Boolean, required: true },
  amenities: [{ type: String }],
});
const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
