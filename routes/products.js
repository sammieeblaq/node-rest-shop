const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/fileUpload");

const productController = require("../controllers/products");



// Route Handlers
router.get("/", productController.getProducts);

// Because of the parse form-data we put the image parser before the auth
router.post("/", auth, upload.single("productImage"), productController.postProducts);

router.get("/:id", productController.getProductsId);

router.patch("/:id", productController.updateProductId);

router.delete("/:id", productController.deleteProductId);


module.exports = router;