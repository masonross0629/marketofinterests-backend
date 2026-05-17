<<<<<<< HEAD
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

=======
<<<<<<< HEAD
import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ USE YOUR REAL STRIPE KEY HERE OR ENV VARIABLE
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

/* 🔥 CHECKOUT (FIXED VERSION) */
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { title, price, courseId } = req.body;

        // ✅ FIX: only require title + price
        if (!title || !price) {
            return res.status(400).json({ error: "Missing data" });
        }

        const amount = Math.round(price * 100);

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

            // ✅ NO SPLIT PAYMENT FOR NOW (removes error)
            success_url: `https://marketofinterests.com/course.html?id=${courseId}&success=true`,
            cancel_url: `https://marketofinterests.com/course.html?id=${courseId}`
        });

        res.json({ url: session.url });

    } catch (err) {
        console.error("STRIPE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

/* TEST ROUTE */
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

/* START SERVER */
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
=======
import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ USE YOUR REAL STRIPE KEY HERE OR ENV VARIABLE
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

/* 🔥 CHECKOUT (FIXED VERSION) */
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { title, price, courseId } = req.body;

        // ✅ FIX: only require title + price
        if (!title || !price) {
            return res.status(400).json({ error: "Missing data" });
        }

        const amount = Math.round(price * 100);

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

            // ✅ NO SPLIT PAYMENT FOR NOW (removes error)
            success_url: `https://marketofinterests.com/course.html?id=${courseId}&success=true`,
            cancel_url: `https://marketofinterests.com/course.html?id=${courseId}`
        });

        res.json({ url: session.url });

    } catch (err) {
        console.error("STRIPE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

/* TEST ROUTE */
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

/* START SERVER */
app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
>>>>>>> acf88eeb16d7c59832d269794e24d10f4ee4db49
>>>>>>> 1c366371eae82b906c792e515f1e79a026f53200
});