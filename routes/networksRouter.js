const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const Networks = require("../models/networks");

// @desc    Post networks in the news comment
// @route   POST /networks/
// @access  public
router.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      let { name, url } = req.body;
      let updateNetwork = await Networks.create({
        name,
        url,
      });
      res.send(updateNetwork);
    } catch (err) {
      res.status(400).json(err);
    }
  })
);

// @desc    Get networks in the news comment
// @route   GET /networks/
// @access  public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    try {
      let networks = await Networks.find();
      res.send(networks);
    } catch (err) {
      res.status(400).json(err);
    }
  })
);

router.get("/updateSchema", async (req, res) => {
  try {
    let networks = await Networks.updateOne(
      { name: "Washington Times" },
      {
        $set: {
          name: "The Washington Times",
        },
      }
    );
    res.send(networks);
  } catch (e) {
    res.status(400).json(err);
  }
});

module.exports = router;
