import express from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import bodyParser from 'body-parser';
import cors from "cors";

import router from "./Routes/user-routes.js";
import routers from "./Routes/product-routes.js";
import routerss from "./Routes/dashboard-routes.js";
import routersss from "./Routes/dashboardagent-routes.js";
import routerAddress from "./Routes/user-address-routes.js";
import config from "./config.js";

const app = express();

const stripe = new Stripe(
  "sk_test_51O96wfSH8i1UqUchc81vmn8Mka2bbbMrCW2vZKLEvGRTZDqWx2KlxkbLzdQnAJ0ipNA1UtO9Y83vX4x7KXjz5E4Z00JxrbAflY"
);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static('public'));
app.use("/ecommerce/user", router);
app.use("/ecommerce/product", routers);
app.use("/ecommerce/manager", routerss);
app.use("/ecommerce/agent", routersss);
app.use("/ecommerce/user-address", routerAddress);

app.post("/checkout", async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid or empty item data" });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Product Name",
        },
        unit_amount: item.price * 100,
      },
      quantity: 1, 
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://spectastyle.vercel.app/success",
      cancel_url: "https://spectastyle.vercel.app/cancel",
    });

    if (!session || !session.id) {
      return res.status(500).json({ error: "Failed to create a checkout session" });
    }

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const mongoURI = config.mongoURI;

mongoose
  .connect(mongoURI)
  .then(() => app.listen(5500))
  .then(() => console.log("connected to db at port 5500 :)"))
  .catch((err) => console.log(`${err} is error`));
