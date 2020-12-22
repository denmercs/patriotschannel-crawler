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
      const isRegistered = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (isRegistered !== null) {
        res
          .status(400)
          .json({ message: "This email or username is already registered!" });
      } else {
        const user = await User.create({
          username: username,
          email: email,
          password: bcrypt.hashSync(password, 8),
        });
        const emailToken = generateToken(user._id, "1h");
        // check environment variables
        let envUrl;
        process.env.NODE_ENV === "dev"
          ? (envUrl = "http://localhost:5000")
          : (envUrl = process.env.BACKEND_URL);
        const userURL = `${envUrl}/users/confirmation/${emailToken}`;
        const message = {
          from: '"We The People 👻" <patriotschannelcompany@gmail.com>', // sender address
          to: `${user.email}`, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "We need to authorized your email", // plain text body
          html: `<p>Please click this to authorized email <a href=${userURL} target="_blank">Activate</a>`, // html body
        };
        // send email to the user's provided email
        sendEmail(message);
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
            token: generateToken(userFiltered._id, "30d"),
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

// @desc    Auth user, match password & send token
// @route   POST /users/login
// @access public
router.get("/confirmation/:token", async (req, res) => {
  try {
    let token = req.params.token;
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    await User.updateOne({ _id: verified.id }, { confirmed: true });
  } catch (err) {
    res.send(err);
  }

  return res.redirect("http://localhost:3000/login");
});

// @desc Auth user, reset password & send token
// @route POST /users/forgot
// @access public
router.post(
  "/forgot",
  asyncHandler(async (req, res) => {
    try {
      const { email } = req.body;

      let user = await User.findOne({ email });

      if (user === null) {
        res.status(400).json({
          message: "Email not found. Please provide the correct email address",
        });
      }

      if (user !== null) {
        let emailToken = generateToken(user.id, "1h");
        const userURL = `http://localhost:3000/reset/${emailToken}`;
        // send email to the user's provided email
        const message = {
          from: '"We The People 👻" <patriotschannelcompany@gmail.com>', // sender address
          to: `${user.email}`, // list of receivers
          subject: "Password Reset ✔", // Subject line
          text: "Please click this link to reset password", // plain text body
          html: `<p>Please click link to reset password <a href=${userURL}>Reset Password</a>`, // html body
        };
        sendEmail(message);
      }

      res.status(200).json({ message: "received and sent!" });
    } catch (err) {
      res.status(401).json(err);
    }
  })
);

router.post("/reset", async (req, res) => {
  try {
    let { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findOne({ _id: decoded.id });
    console.log(process.env.NODE_ENV);

    if (user) {
      let passwordUpdated = await User.updateOne(
        { _id: user.id },
        { password: bcrypt.hashSync(password, 8) }
      );

      res.status(200).json(passwordUpdated);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
