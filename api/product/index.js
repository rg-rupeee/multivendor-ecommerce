const express = require("express");
const router = express.Router();

const controller = require("./controllers/productController");

/* get all products */
router.get("/", controller.getAllProducts);

/* get all categories */
router.get("/category/list", controller.getAllCategories);

/* get product by id */
router.get("/:productId", controller.getProductById);

/* get all products by category */
router.get("/category/:categoryId", controller.getProductByCategory);

/* get product rewiews */
router.get("/:productId/review", controller.getProductReviews);

/* get product ratings */
router.get("/:productId/rating", controller.getProductRatings);

/* review a product */
router.post("/:productId/rewiew", controller.reviewProduct);

/* delete product rewiew - only delete his own rewiew */
router.delete("/:productId/rewiew/:reviewId", controller.deleteProductReview);

module.exports = router;
