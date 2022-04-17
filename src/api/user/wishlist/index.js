const express = require("express");
const router = express.Router();

const wishlistController = require("./controller/wishlistController");

const User = require("../../../models/User");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const { requiredFields } = require("../../_util/check");

router.get("/", protect(User), wishlistController.getMyWishlist);

router.post(
  "/:productId",
  protect(User),
  wishlistController.addProductToWishlist
);

router.delete(
  "/:productId",
  protect(User),
  wishlistController.removeProductFromWishlist
);

router.get(
  "/check/:productId",
  protect(User),
  wishlistController.checkProductInWishlist
);

router.get(
  "/check",
  protect(User),
  requiredFields("products"),
  wishlistController.checkMultipleProductInWishlist
);

module.exports = router;
