const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

// The port number.
const port = process.env.PORT || 3000


// Handling the routes
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");

mongoose.connect("mongodb://localhost/node-rest-shop", { useNewUrlParser: true });
mongoose.Promise = global.Promise;


app.use(logger("dev"));
app.use("/uploads", express.static("uploads"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());



app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

// Error Handling
app.use((error, req, res) => {
	console.log(error)
	const message = error.message;
	res.status(404).json({
		message: message,
	});
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});