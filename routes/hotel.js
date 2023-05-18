const hotelModel = require("../models/hotelmodel");
const cateModel = require("../models/categorymodel");

var mongoose = require("mongoose");

const express = require("express");
const Hotel = require("../models/hotelmodel");
var router = express.Router();
// const multer = require("multer");
router.get("/res", async (req, res) => {
  const hotelmodel = await hotelModel.find();
  res.status(200).json(hotelmodel);
});

router.post("/res", async (req, res) => {
  // const {title,description,price,image}=req.body
  const hotel = new Hotel({
    name: req.body.name,
    address: req.body.address,
    description: req.body.description,
    image_url: req.body.image_url,
    rating: req.body.rating,
    amenities: req.body.amenities,
    price_range: req.body.price_range,
    nearby_attractions: req.body.nearby_attractions,
    rooms: req.body.rooms,
    star: req.body.star,
  });
  const saveHotel = await hotel.save();
  console.log(saveHotel);
  console.log(hotel);
  res.json(saveHotel);
});

router.put("/:id", (req, res) => {
  Food.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      address: req.body.address,
      description: req.body.description,
      image_url: req.body.image_url,
      rating: req.body.rating,
      image_url: req.body.image_url,
      amenities: req.body.amenities,
      nearby_attractions: req.body.nearby_attractions,
      rooms: req.body.rooms,
    },
    { new: true }
  )
    .then(() => {
      res.send({ message: "Oke" });
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message,
      });
    });
});
router.delete("/:id", (req, res) => {
  Food.findByIdAndRemove(req.params.id)
    .then(() => {
      res.send({ message: "Oke" });
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message,
      });
    });
});
router.get("/getone/:star", (req, res) => {
  Hotel.find({ star: req.params.star })
    .populate("star")
    .then((orders) => {
      // In danh sách orderDetail

      res.json(
        orders
          .map((item) => item)
          .flat()
          .flat()
        // .flat()
      );
    })
    .catch((err) => {
      console.error(err);
    });
});
module.exports = router;
