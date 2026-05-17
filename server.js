const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();

app.use(cors());
app.use(express.json());

/* STRIPE */

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* TEST ROUTE */

app.get("/", (req, res) => {
    res.send("Backend working 🚀");
});

/* CHECKOUT */

app.post("/create-checkout-session", async (req, res) => {

    try {

        const {
            title,
            price,
            courseId
        } = req.body;

        if (!title || !price || !courseId) {

            return res.status(400).json({
                error: "Missing data"
            });

        }

        const session =
        await stripe.checkout.sessions.create({

            payment_method_types: ["card"],

            mode: "payment",

            line_items: [

                {
                    price_data: {

                        currency: "usd",

                        product_data: {
                            name: title,
                        },

                        unit_amount:
                        Math.round(price * 100),

                    },

                    quantity: 1,

                },

            ],

            success_url:
            `https://marketofinterests.com/my%20courses.html?success=true&courseId=${courseId}`,

            cancel_url:
            `https://marketofinterests.com/course.html?id=${courseId}`,

        });

        res.json({
            url: session.url
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

/* PORT */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});