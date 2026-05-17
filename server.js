const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();

app.use(cors());
app.use(express.json());

/* STRIPE */

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* CREATE CHECKOUT SESSION */

app.post("/create-checkout-session", async (req, res) => {

    try {

        const {
            title,
            price,
            courseId
        } = req.body;

        /* VALIDATION */

        if (!title || !price || !courseId) {

            return res.status(400).json({
                error: "Missing required data"
            });

        }

        /* STRIPE SESSION */

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

            /*
            SUCCESS:
            redirects to owned course library
            */

            success_url:
            `https://marketofinterests.com/my%20courses.html?success=true&courseId=${courseId}`,

            /*
            CANCEL:
            returns back to course page
            */

            cancel_url:
            `https://marketofinterests.com/course.html?id=${courseId}`,

        });

        /* SEND CHECKOUT URL */

        res.json({
            url: session.url
        });

    } catch (err) {

        console.error(
            "STRIPE ERROR:",
            err.message
        );

        res.status(500).json({
            error: err.message
        });

    }

});

/* TEST ROUTE */

app.get("/", (req, res) => {

    res.send(
        "Market Of Interests backend running 🚀"
    );

});

/* PORT */

const PORT =
process.env.PORT || 3000;

/* START SERVER */

app.listen(PORT, () => {

    console.log(
        "Server running on port " + PORT
    );

});