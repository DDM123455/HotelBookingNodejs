const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const User = require("../models/usermodel");
const mime = require("mime-types");

const router = express.Router();
// Đăng ký tài khoản]

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Xử lý request POST tải lên hình ảnh
router.post("/upload-image", upload.single("image"), (req, res) => {
  res.send("ok");

  // Lưu thông tin hình ảnhvào MongoDB ở đây...
});
router.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(
    "C:\\Users\\sickb\\OneDrive\\Máy tính\\HotelBooking\\",
    "images",
    filename
  );

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      const contentType = mime.lookup(filename);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});
router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    customerPoints: req.body.customerPoints,
  });
  console.log(newUser);
  await User.findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        res.json("user nay da ton tại");
      } else {
        newUser
          .save()
          .then((data) => {
            res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((e) => console.log(e));
});
router.get("/register", (req, res) => {
  const alluser = User.find({})
    .then((users) => {
      res.send({ users: users });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.put("/update/:id", async (req, res) => {
  try {
    const updatedFields = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== null && req.body[key] !== undefined) {
        updatedFields[key] = req.body[key];
      }
    });
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
router.post("/login", (req, res) => {
  // Lấy thông tin người dùng từ request body

  const email = req.body.email;
  const password = req.body.password;
  // Tìm kiếm user trong database
  console.log(req.body, "log");
  User.findOne({ email: email, password: password })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => console.log(err, "ee"));
});

// Kiểm tra token và quyền truy cập
router.get("/profile", (req, res) => {
  // Lấy token từ cookie

  // Lấy thông tin user từ decoded token
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).send("Internal server error");
      return;
    }

    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }

    // Kiểm tra quyền truy cập
    if (role !== "admin" && user.role !== "user") {
      res.status(401).send("Unauthorized");
      return;
    }
    // Trả về thông tin user
    res.status(200).json({
      username: user.username,
      password: user.password,
    });
  });
});

module.exports = router;
