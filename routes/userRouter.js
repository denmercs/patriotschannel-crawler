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

module.exports = router;
