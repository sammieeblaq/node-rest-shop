const express = require('express');
const router = express.Router();
const userController = require("../controllers/users");

router.post("/signup", userController.singup);

router.post("/login", userController.login);

router.delete("/:id", userController.deleteUser);


module.exports = router;