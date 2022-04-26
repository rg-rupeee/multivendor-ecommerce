const catchAsync = require("../../../../utils/catchAsync");
const Review = require("../../../../models/Review");
const APIFeatures = require("../../../_util/apiFeatures");

exports.getReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const features = new APIFeatures(Review.find({ productId }), req.query)
    .sort()
    .paginate();

  const reviews = await features.query;

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
