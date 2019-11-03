const Order = require("../models/order");

// To avoid a product that doesnt exist we call Product
const Product = require("../models/product");

exports.getOrders = (req, res) => {
	Order.find()
		.select(" product _id quantity ")
		.populate("product", "name price")
		.exec()
		.then((docs) => {
			res.status(200).json({ 
				count: docs.length,
				orders: docs.map(doc => {
					return {
						_id: doc._id,
						product: doc.product,
						quantity: doc.quantity,
						request: {
							type: "GET",
							url: `http://localhost:3000/orders/${doc._id}`
						}
					}
				})
			});
		}).catch((err) => {
			res.status(500).json({ error: err });
		});
}

exports.postOrders = (req, res) => {
	const id = req.body.productId;
	Product.findById({ _id: id })
		.then(product => {
			if (!product) {
				res.status(404).json({ 
					message: "Product not found"
				});
			}
			const order = new Order({
				product: req.body.productId,
				quantity: req.body.quantity
			})
			return order.save()
		})
		.then((result) => {
			res.status(201).json({ 
				message: "Order Created",
				createdOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: "GET",
					url: `http://localhost:3000/orders/${result._id}`
				}
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		})
}

exports.getOrderId = (req, res) => {
	const { id } = req.params;
	Order.findById({ _id: id })
		.select(" _id product quantity 	")
		.populate("product", "name price")
		.exec()
		.then((order) => {
			// If the order does not exist: 
			if (!order) {
				res.status(404).json({ 
					message: "Order Not Found"
				});
			}
			res.status(200).json({ 
				order: order,
				request: {
					type: "GET",
					url: `http://localhost:3000/orders`
				}
			});
		}).catch((err) => {
			res.status(500).json({ error: err });
		});
}

exports.deleteOrderId = (req, res) => {
	const id = req.params.id;
	Order.findOneAndDelete({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: "Order Deleted",
				request: {
					type: "POST",
					url: `http://localhost:3000/orders`,
					body: { productId: "Id", quantity: "Number" }
				}
			});
		}).catch((err) => {
			
		});
}