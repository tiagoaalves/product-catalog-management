const controller = require("../controllers/products");
const router = require("express").Router();

router.get("/", controller.getAllProducts);
router.get("/:product_id", controller.getProductsById);
router.get("/category/:category", controller.getProductsByCategory);
router.patch("/:product_id", controller.updateProductCategory);
router.put("/:product_id", controller.updateProduct);
router.post("/", controller.createProduct);
router.delete("/:product_id", controller.deleteProduct);

module.exports = router;
