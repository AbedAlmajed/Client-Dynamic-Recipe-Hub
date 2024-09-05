// const Stripe = require("stripe");
// const Payment = require("../Models/pyament");

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const createPaymentIntent = async (req, res) => {
//   const { amount, currency } = req.body;

//   if (!amount || isNaN(amount) || amount <= 0) {
//     return res.status(400).json({ error: "Invalid amount" });
//   }

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//     });

//     const payment = new Payment({
//       stripePaymentId: paymentIntent.id,
//       amount,
//       currency,
//       status: paymentIntent.status,
//     });

//     await payment.save();

//     res.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createPaymentIntent,
// };
const Stripe = require("stripe");
const mongoose = require("mongoose");
const Payment = require("../Models/pyament");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { userId, productId, fullName, email, Alldata, Prise } = req.body;

  // تحديد السعر الثابت (مثلاً: 1000 سنتات = 10 دولارات)
  const amount = 1000; // السعر ثابت بالـ سنتات
  const currency = "usd";

  if (!fullName || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    const payment = new Payment({
      stripePaymentId: paymentIntent.id,
      amount: Prise,
      currency,
      status: paymentIntent.status,
      userId: userId,
      productId: productId ? mongoose.Types.ObjectId(productId) : null,
      fullName,
      email,
      items: Alldata,
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPaymentIntent,
};
