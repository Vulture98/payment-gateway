import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import path from "path";

dotenv.config();
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.post("/create-order", async (req, res) => {
    try {
        const options = {
            amount: 50000, // amount in smallest currency unit (paise for INR)
            currency: "INR",
            receipt: "order_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
