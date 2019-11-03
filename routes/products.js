const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");

const productController = require("../controllers/products");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
})

// Route Handlers
router.get("/", productController.getProducts);

// Because of the parse form-data we put the image parser before the auth
router.post("/", auth, upload.single("productImage"), productController.postProducts);

router.get("/:id", productController.getProductsId);

router.patch("/:id", productController.updateProductId);

router.delete("/:id", productController.deleteProductId);


module.exports = router;