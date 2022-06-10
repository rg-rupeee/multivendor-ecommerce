const express = require("express");
const router = express.Router();

const User = require("../../../models/User");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const { requiredFields } = require("../../_util/check");
const cartController = require("./controller/cartController");

router.get("/", protect(User), cartController.getMyCart);

/* remove product from cart */
router.delete(
  "/:productId",
  protect(User),
  cartController.removeProductFromCart
);

/* add product to cart or update product quantity */
router.patch(
  "/:productId/:quantity",
  protect(User),
  cartController.updateProductQuantityInCart
);

router.put(
  "/",
  protect(User),
  requiredFields("products"),
  cartController.updateCart
);

module.exports = router;
