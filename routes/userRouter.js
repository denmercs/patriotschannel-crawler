const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const User = require("../models/users");
const bcrypt = require("bcryptjs");

// @desc    Auth user and bcrypt password
// @route   POST /users/register
// @access  Public

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      username: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
    });
  })
);

// @desc    Auth user, match password & get token
// @route   POST /users/login
// @access public

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.find({ email });

    if (user) {
      if (bcrypt.compareSync(password, user[0].password)) {
        res.send({
          _id: user[0]._id,
          username: user[0].username,
          email: user[0].email,
          isAdmin: user[0].isAdmin,
          token: generateToken(user[0]._id),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);
module.exports = router;
