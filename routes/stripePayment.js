const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");

router.post(
  "/payment",
  asyncHandler(async (req, res) => {
    const { money, email } = req.body;
    // Create a PaymentIntent with the order amount and currency

    const calculateOrderAmount = (money) => {
      // Replace this constant with a calculation of the order's amount
      // Calculate the order total on the server to prevent
      // people from directly manipulating the amount on the client

      return money;
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(money),
      currency: "usd",
      payment_method_types: ["card"],
      receipt_email: email,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  })
);

router.post("/subscribe", async (req, res) => {
  const { email, payment_method } = req.body;

  try {
    const customer = await stripe.customers.create({
      payment_method: payment_method,
      email: email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: "plan_G......" }],
      expand: ["latest_invoice.payment_intent"],
    });

    const status = subscription["latest_invoice"]["payment_intent"]["status"];
    const client_secret =
      subscription["latest_invoice"]["payment_intent"]["client_secret"];

    res.json({ client_secret: client_secret, status: status });
  } catch (err) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
});

router.post("/create-checkout-session", async (req, res) => {
  const { priceId, amount, modeOfPayment } = req.body;

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Stubborn Attachments",
              images: ["https://i.imgur.com/EHyR2nP.png"],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      mode: modeOfPayment,

      success_url: `http://localhost:5000?success=true`,

      cancel_url: `http://localhost:5000?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
});

module.exports = router;
