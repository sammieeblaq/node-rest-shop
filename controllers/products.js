const Product = require("../models/product");

// docs refers to products
exports.getProducts = (req, res) => {
    Product.find()
        .select(" name price _id productImage ")
		.exec()
		.then((docs) => {
            const response = {
                count : docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: "GET",
                            url: `http://localhost:3000/products/${doc._id}`
                        }
                    }
                })
            };
			res.status(200).json({ docs: response });
		}).catch((err) => {
			res.status(500).json({ error: err });
		});
}

exports.postProducts = (req, res) => {
	const product = new Product({
		name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
	});
	product.save()
		.then((result) => {
			res.status(200).json({
				createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: "POST",
                        url: `https://localhost:3000/products/${result._id}`
                    }
                }
			});
		})
		.catch((err) => {
			res.status(500).json({ err: err});
		});
}


exports.getProductsId = (req, res) => {
	const id = req.params.id;
    Product.findById({ _id: id })
        .select(" _id name price productImage ")
		.exec()
		.then(product => {
			// If a product exists 
			if (product) {
				res.status(200).json({ 
                    product: product,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/products`
                    }
                });	
			} else {
				res.status(404).json({ message: "No valid Entry for ID" });
			}
		})
		.catch(err => {
			res.status(500).json({ err: err});
		});
}

exports.updateProductId = (req, res) => {
	const id = req.params.id;
	// To check if we really want to add both [ name $ price ]
	const updateOps = {};
	for (let ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Product.findOneAndUpdate({ _id: id }, { $set: updateOps })
		.exec()
		.then((result) => {
			res.status(200).json({ 
                message: "Product Updated",
                request: {
                    type: "GET",
                    url: `http://localhost:3000/products/${id}`
                }
            });
		}).catch((err) => {
			res.status(500).json({ error: err });
		});
}

exports.deleteProductId = (req, res) => {
	const id = req.params.id
	Product.findOneAndDelete({ _id: id })
		.exec()
		.then(product => {
			res.status(200).json({
                message: "Product Deleted",
                request: {
                    type: "POST",
                    url: `http://localhost:3000/products`,
                    body: {
                        name: "String", price: "Number"
                    }
                }
            });
		}).catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
}