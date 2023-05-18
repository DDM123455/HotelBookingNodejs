const express = require("express");

const User = require("../models/usermodel");
const router = express.Router();
// Đăng ký tài khoản
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
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
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
