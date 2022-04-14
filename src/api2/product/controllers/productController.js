const catchAsync = require("../../../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {});

exports.getAllCategories = catchAsync(async (req, res, next) => {});

exports.getProductById = catchAsync(async (req, res, next) => {});

exports.getProductByCategory = catchAsync(async (req, res, next) => {});

exports.getProductReviews = catchAsync(async (req, res, next) => {});

exports.getProductRatings = catchAsync(async (req, res, next) => {});

exports.reviewProduct = catchAsync(async (req, res, next) => {});

exports.deleteProductReview = catchAsync(async (req, res, next) => {});
