const express = require("express");
const router = express.Router();

const reviewController = require("./controller/reviewController");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const { requiredFields } = require("../../_util/check");
const User = require("../../../models/User");

router.get("/:productId", reviewController.getReviews);

router.post(
  "/:productId",
  protect(User),
  requiredFields("review", "rating"),
  reviewController.addReview
);

router.patch("/:reviewId", protect(User), reviewController.updateReview);

router.delete("/:reviewId", protect(User), reviewController.deleteReview);

module.exports = router;
