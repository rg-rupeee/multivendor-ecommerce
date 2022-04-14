const express = require("express");
const router = express.Router();

const authRouter = require("./auth/index");
const buyRouter = require("./buy/index");

const controller = require("./controllers/userContoller");

router.use("/auth", authRouter);

router.use("/buy", buyRouter);

/* get user profile */
router.get("/profile", controller.getUserProfile);

/* update user profile */
router.patch("/profile", controller.updateUserProfile);

/* get user's cart */
router.get("/cart", controller.getUserCart);

/* add product to cart */
router.patch("/cart/add/:productId", controller.addProductToCart);

/* remove product from cart */
router.patch("/cart/remove/:productId", controller.removeProductFromCart);

/* update cart */
router.put("/cart/update", controller.updateCart);

/* get user's wishlist */
router.get("/wishlist", controller.getUserWishlist);

/* add product to wishlist */
router.patch("/wishlist/add/:productId", controller.addProductToWishlist);

/* remove product from wishlist */
router.patch(
  "/wishlist/remove/:productId",
  controller.removeProductFromWishlist
);

/* get users orders */
router.get("/orders", controller.getUsersOrder);

/* get order details */
router.get("/orders/:orderId", controller.getOrderById);

module.exports = router;
