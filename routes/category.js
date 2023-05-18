const Categories = require("../models/categorymodel.js");

const express = require("express");
var router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Categories.find();
  res.status(200).json(categories);
});
router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  // const {title,description,price,image}=req.body
  const categories = new Categories({
    title: req.body.title,
    image: req.body.image,
    name: req.body.name,
    star:req.body.star,
  });
  const saveFood = await categories.save();
  res.send(saveFood);
});
router.get("/:id", (req, res) => {
  Categories.findById()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message,
      });
    });
});

module.exports = router;
