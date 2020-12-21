const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/nodeMailer");
const { Error } = require("mongoose");
// @desc    Auth user and bcrypt password
// @route   POST /users/register
// @access  Public

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const isRegistered = await User.find({ email: email });

      if (isRegistered.length !== 0) {
        res.status(400).json({ message: "This email is registered already!" });
      } else {
        const user = await User.create({
          username: username,
          email: email,
          password: bcrypt.hashSync(password, 8),
        });
        let emailToken = jwt.sign({ id: user._id }, process.env.EMAIL_SECRET, {
          expiresIn: "1hr",
        });
        const userURL = `${process.env.BACKEND_URL}/users/confirmation/${emailToken}`;
        // send email to the user's provided email
        sendEmail(user.email, userURL);
        res.status(201).json({ message: "registered!" });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  })
);

// @desc    Auth user, match password & get token
// @route   POST /users/login
// @access public

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.find({ email });

      if (user.length === 0) {
        res
          .status(400)
          .json({ message: "Email address not found! Please signup to join!" });
      }

      if (!user[0].confirmed) {
        res.status(401).json({
          message:
            "Please check your email! We just need to validate your email address to activate your Patriots Channel account.",
        });
      }

      if (user[0].confirmed) {
        let userFiltered = user[0];
        if (bcrypt.compareSync(password, userFiltered.password)) {
          res.send({
            _id: userFiltered._id,
            username: userFiltered.username,
            email: userFiltered.email,
            confirmed: userFiltered.confirmed,
            isAdmin: userFiltered.isAdmin,
            token: generateToken(userFiltered._id),
          });
        } else {
          res.status(400).json({
            message: "Wrong password! Please enter a correct password.",
          });
        }
      }
    } catch (err) {
      res.status(401).send(err);
    }
  })
);

// @desc    Auth user, match password & get token
// @route   POST /users/login
// @access public
router.get("/confirmation/:token", async (req, res) => {
  try {
    let token = req.params.token;
    const verified = jwt.verify(token, process.env.EMAIL_SECRET);
    await User.updateOne({ _id: verified.id }, { confirmed: true });
  } catch (err) {
    res.send(err);
  }

  return res.redirect("http://localhost:3000/login");
});
module.exports = router;
