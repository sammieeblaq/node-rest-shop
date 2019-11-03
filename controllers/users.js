const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.singup = (req, res) => {
	// To find if an email already exists in the db
	const password = req.body.password;
	const email = req.body.email;
	User.find({ email: email })
		.exec()
		.then(user => {
			// Checking if a password exists already. (If the same password already exists)
			if (user.length >= 1) {
				res.status(422).json({ message: "Email Already exists" });
			} else {
				bcrypt.hash(password, 10, (err, hash) => {
					if (err) {
						res.status(500).json({
							error: err
						});
					} else {
						const user = new User({
							email: email,
							password: hash
						});
						user.save()
							.then(result => {
								console.log(result);
								res.status(201).json({ 
									message: "User Created"
								});
							})
							.catch(err => {
								res.status(500).json({ error: err });
							})
					}
				})

			}
		});
};


exports.login = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.find({ email: email })
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(401).json({ 
					message: "Auth Failed"
				})
			}
			bcrypt.compare(password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({ 
						message: "Auth Failed"
					})
				}
				if (result) {
					const token = jwt.sign({
						email: user[0].email,
						userId: user[0]._id
					}, "secret", { expiresIn: "1h" } ); // Make sure to use private key. 
					return res.status(200).json({ 
						message: "Auth Succesful",
						token: token
				});
				}
				res.status(401).json({ message: "Auth failed" });
			});  
		})
		.catch(err => {
			res.status(500).json({ error: err });
		})
};


exports.deleteUser = (req, res) => {
	const id = req.params.id;
	User.findByIdAndDelete({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({ message: "User Deleted" });
		}).catch((err) => {
			res.status(500).json({ error: err });
		});
}