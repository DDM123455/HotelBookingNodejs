const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  guestName: { type: String },
  guestEmail: { type: String },
  guestPhone: { type: String },
  checkInDate: { type: String },
  checkOutDate: { type: String },
  roomType: { type: String },
  price: { type: String },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  point: Number,
  quantity: Number,
});

module.exports = mongoose.model("booking", bookingSchema);
