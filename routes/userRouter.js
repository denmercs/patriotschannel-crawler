const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/nodeMailer");
// @desc    Auth user and bcrypt password
// @route   POST /users/register
// @access  Public

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 8),
      });

      let emailToken = jwt.sign({ id: user._id }, process.env.EMAIL_SECRET);
      const url = `http://localhost:5000/users/confirmation/${emailToken}`;

      // send email to the user's provided email
      await sendEmail(user.email, url);

      res.status(200).json(user);
    } catch (err) {
      res.status(400).json(err.message);
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

      if (user && user.confirmed) {
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
          res.status(400).json({ message: "Invalid login" });
        }
      }

      if (!user.confirmed) {
        res.status(401).json({
          message:
            "Please check your email! We just need to validate your email address to activate your Patriots Channel account.",
        });
      }
    } catch (err) {
      res.status(401).send({ message: err.message });
    }
  })
);

// @desc    Auth user, match password & get token
// @route   POST /users/login
// @access public
router.get("/confirmation/:token", async (req, res) => {
  try {
    // let user = User.find({user})
    let token = req.params.token;
    const verified = jwt.verify(token, process.env.EMAIL_SECRET);
    let confirmedUpdated = await User.updateOne(
      { _id: verified.id },
      { confirmed: true }
    );

    res.status(200).json({ update: confirmedUpdated });
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
