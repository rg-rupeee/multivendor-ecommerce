const catchAsync = require("../../../../utils/catchAsync");
const Review = require("../../../../models/Review");

exports.getReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const reviews = await Review.find({ productId });

  return res.json({
    status: "success",
    reviews,
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  const { productId, review, rating } = req.body;

  const newReview = await Review.create({
    userId: req.user.id,
    productId,
    review,
    rating,
  });

  return res.status(201).json({
    status: "success",
    review: newReview,
  });
});
