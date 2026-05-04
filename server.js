import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe("sk_test_YOUR_KEY");

/* 🔥 CREATE CONNECT ACCOUNT */
app.post("/create-account", async (req, res) => {
    const account = await stripe.accounts.create({
        type: "express"
    });

    res.json({ accountId: account.id });
});

/* 🔥 CREATE ONBOARDING LINK */
app.post("/onboard", async (req, res) => {
    const { accountId } = req.body;

    const link = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: "http://127.0.0.1:5500/create course.html",
        return_url: "http://127.0.0.1:5500/create course.html",
        type: "account_onboarding"
    });

    res.json({ url: link.url });
});

/* 🔥 CHECKOUT WITH SPLIT */
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { title, price, courseId, instructorStripeId } = req.body;

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

            success_url: `http://127.0.0.1:5500/course.html?id=${courseId}&success=true`,
            cancel_url: `http://127.0.0.1:5500/course.html?id=${courseId}`
        });

        res.json({ url: session.url });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server running");
});