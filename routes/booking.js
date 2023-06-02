const express = require("express");
var router = express.Router();
const BookingModel = require("../models/booking.js");
const User = require("../models/usermodel.js");
const Hotel = require("../models/hotelmodel.js");

var to;

router.get("/", async (req, res) => {
  const bookingmodel = await BookingModel.find();
  res.status(200).json(bookingmodel);
});
router.post("/", async (req, res) => {
  const categories = new BookingModel({
    guestName: req.body.guestName,
    guestEmail: req.body.guestEmail,
    guestPhone: req.body.guestPhone,
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
    price: req.body.price,
    quantity: req.body.quantity,
    point: req.body.point,
    roomType: req.body.roomType,
    status: req.body.status,
    hotelName: req.body.hotelName,
    toado1: req.body.toado1,
    toado2: req.body.toado2,
  });
  const numberQuan = parseInt(req.body.quantity);

  const saveBooking = await categories.save();

  // Tính toán và cập nhật tổng số điểm của khách hàng
  const totalPoints = await BookingModel.aggregate([
    { $match: { guestName: req.body.guestName } },
    { $group: { _id: "$guestName", totalPoints: { $sum: "$point" } } },
  ]);

  if (totalPoints.length > 0) {
    const updatedUser = await User.findOneAndUpdate(
      { name: req.body.guestName },
      { customerPoints: totalPoints[0].totalPoints },
      { new: true }
    );
  }
  console.log(req.body.hotelName);
  console.log(req.body.roomType);

  const updatedHotel = await Hotel.findOneAndUpdate(
    { name: req.body.hotelName, "rooms.roomName": req.body.roomType },
    { $inc: { "rooms.$.quantity": -numberQuan } },
    { new: true }
  );
  console.log(updatedHotel);

  res.send(saveBooking);
});

// router.get("/point/:guestName", (req, res) => {
//   BookingModel.find({ guestName: req.params.guestName })
//     .then(async (data) => {
//       let totalPoints = 0;
//       to = data;
//       for (let booking of data) {
//         if (booking.point) {
//           totalPoints += booking.point;
//         }
//       }
//       const booking = await User.findOneAndUpdate(
//         { name: req.params.guestName },
//         { customerPoints: totalPoints },
//         { new: true }
//       );

//       res.json(totalPoints);
//     })
//     .catch((error) => {
//       res.status(500).send({
//         message: error.message,
//       });
//     });
// });
// router.post("/", async (req, res) => {
//   const categories = new BookingModel({
//     guestName: req.body.guestName,
//     guestEmail: req.body.guestEmail,
//     guestPhone: req.body.guestPhone,
//     checkInDate: req.body.checkInDate,
//     checkOutDate: req.body.checkOutDate,
//     price: req.body.price,
//     quantity: req.body.quantity,
//     point: req.body.point,
//     roomType: req.body.roomType,
//     status: req.body.status,
//   });

//   // let totalPoints = 0;
//   // for (let booking of data) {
//   //   if (booking.point) {
//   //     totalPoints += booking.point;
//   //   }
//   // }

//   // const point = await User.findOneAndUpdate(
//   //   { name: req.params.guestName },
//   //   { customerPoints: totalPoints },
//   //   { new: true }
//   // );
//   console.log(totalPoints, "123");
//   const saveFood = await categories.save();
//   res.send(saveFood);
// });

router.post("/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const number = req.body.quantityOrder;

  try {
    const booking = await BookingModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    const updatedHotel = await Hotel.findOneAndUpdate(
      { name: req.body.hotelName, "rooms.roomName": req.body.roomType },
      { $inc: { "rooms.$.quantity": +number } },
      { new: true }
    );
    // cập nhật lại điểm

    res.send(booking);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
router.get("/:guestName", (req, res) => {
  BookingModel.find({ guestName: req.params.guestName })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message,
      });
    });
});
router.get("/point/:guestName", (req, res) => {
  BookingModel.find({ guestName: req.params.guestName })
    .then(async (data) => {
      let totalPoints = 0;
      for (let booking of data) {
        if (booking.point) {
          totalPoints += booking.point;
        }
      }
      const booking = await User.findOneAndUpdate(
        { name: req.params.guestName },
        { customerPoints: totalPoints },
        { new: true }
      );

      res.json(totalPoints);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message,
      });
    });
});

// router.post("/checkout", (req, res) => {
//   Order.findOne({ username: req.body.username })
//     .then((order) => {
//       if (order) {
//         // Nếu order đã tồn tại, chỉ cập nhật thêm orderDetails
//         order.orderDetails.push(req.body.orderDetails);
//         return order.save();
//       } else {
//         // Nếu order chưa tồn tại, tạo mới order
//         const order = new Order({
//           username: req.body.username,
//           createOnDate: formatted,
//           orderDetails: [req.body.orderDetails],
//           status: "0",
//           total: "0",
//         });
//         return order.save();
//       }
//     })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((error) => {
//       res.status(500).send({
//         message: error.message,
//       });
//     });
// });
// const order = new Order({
//   username: req.body.username,
//   createOnDate: formatted,
//   orderDetails: [req.body.orderDetails],
//   status: "0",
//   total: "0",
// });
// order
//   .save()
//   .then((data) => {
//     res.send(data);
//   })
//   .catch((error) => {
//     res.status(500).send({
//       message: error.message,
//     });
//   });
router.post("/placeorder", (req, res) => {
  BookingModel.findByIdAndUpdate(
    { id: req.body.id },
    {
      status: "1",
      total: req.body.total,
      $push: {
        orderDetails: req.body.orderDetails,
      },
    },
    { new: "true" }
  );
});

router.get("/", (req, res) => {
  BookingModel.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message,
      });
    });
});
module.exports = router;
