const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");

router.post(
  "/payment",
  asyncHandler(async (req, res) => {
    const { items, email } = req.body;
    // Create a PaymentIntent with the order amount and currency

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),

      currency: "usd",
      recepients_email: email,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  })
);
