const catchAsync = require("../../../../utils/catchAsync");
const Review = require("../../../../models/Review");
const APIFeatures = require("../../../_util/apiFeatures");
const AppError = require("../../../../utils/appError");

exports.getReviews = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { populate } = req.query;

  let features;
  if (!populate) {
    features = new APIFeatures(
      Review.find({ productId }).populate("userId"),
      req.query
    )
      .sort()
      .paginate();
  } else {
    features = new APIFeatures(
      Review.find({ productId }).populate("userId", "name email"),
      req.query
    )
      .sort()
      .paginate();
  }

  const reviews = await features.query;

  return res.json({
    status: "success",
    reviews,
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  const { review, rating } = req.body;
  const { productId } = req.params;

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

exports.updateReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    return next(new AppError("No review found with that id", 404));
  }

  console.log({ review, user: req.user });

  if (!review.userId.equals(req.user.id)) {
    return next(
      new AppError("Cannot update review that do not belong to user", 403)
    );
  }

  console.log(req.body);

  const updated = await Review.findOneAndUpdate({ _id: reviewId }, req.body, {
    new: true,
    runValidators: true,
  });

  return res.json({
    status: "success",
    review: updated,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    return next(new AppError("No review found with that id", 404));
  }

  if (!review.userId.equals(req.user.id)) {
    return next(
      new AppError("Cannot delete review that do not belong to user", 403)
    );
  }

  await Review.findOneAndDelete({ _id: reviewId });

  return res.json({
    status: "success",
  });
});
