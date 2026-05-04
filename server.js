import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* 🔥 USE ENV VARIABLE (THIS FIXES YOUR ISSUE) */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* 🔥 CREATE CONNECT ACCOUNT */
app.post("/create-account", async (req, res) => {
    try {
        const account = await stripe.accounts.create({
            type: "express"
        });

        res.json({ accountId: account.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

/* 🔥 CREATE ONBOARDING LINK */
app.post("/onboard", async (req, res) => {
    try {
        const { accountId } = req.body;

        const link = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: "https://marketofinterests.com/create%20course.html",
            return_url: "https://marketofinterests.com/create%20course.html",
            type: "account_onboarding"
        });

        res.json({ url: link.url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

/* 🔥 CHECKOUT WITH SPLIT */
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { title, price, courseId, instructorStripeId } = req.body;

        if (!title || !price || !instructorStripeId) {
            return res.status(400).json({ error: "Missing required data" });
        }

        const amount = Math.round(price * 100);
        const fee = Math.round(amount * 0.2);

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],

            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: { name: title },
                    unit_amount: amount
                },
                quantity: 1
            }],

            payment_intent_data: {
                application_fee_amount: fee,
                transfer_data: {
                    destination: instructorStripeId
                }
            },

            success_url: `https://marketofinterests.com/course.html?id=${courseId}&success=true`,
            cancel_url: `https://marketofinterests.com/course.html?id=${courseId}`
        });

        res.json({ url: session.url });

    } catch (err) {
        console.error("STRIPE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

/* 🔥 HEALTH CHECK (optional but useful) */
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

/* 🔥 START SERVER */
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});