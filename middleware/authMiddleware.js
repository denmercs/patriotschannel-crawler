const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/users");

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;
  if (token && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.JWT_SECRET
      );

      req.user = await (await User.findById(decoded.id)).isSelected("password");
      next();
    } catch (err) {
      res.status(401).send({ message: "Not authorized, no token" });
      throw new Error("Not Authorized, token failed!");
    }
  }

  if (!token) {
    res.status(401).send({ message: "Not authorized, no token" });
    throw new Error("Not authorized, no token");
  }
});

module.exports = protect;
