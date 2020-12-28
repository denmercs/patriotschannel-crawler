const mongoose = require("mongoose");

const networksSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
  url: {
    type: String,
    require: true,
    unique: true,
  },
});

const Networks = mongoose.model("Networks", networksSchema);
module.exports = Networks;
