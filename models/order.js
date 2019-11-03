const mongoose = require("mongoose");

// The Product Id
const productId = mongoose.Schema.Types.ObjectId;

const orderSchema = mongoose.Schema({
	product: { type: productId, ref: "Product", required: true },
	quantity: { type: Number, default: 1 }
})

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;