const catchAsync = require("../../../utils/catchAsync");

exports.getUserProfile = catchAsync(async (req, res, next) => {});

exports.updateUserProfile = catchAsync(async (req, res, next) => {});

exports.getUserCart = catchAsync(async (req, res, next) => {});

exports.addProductToCart = catchAsync(async (req, res, next) => {});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {});

exports.updateCart = catchAsync(async (req, res, next) => {});

exports.getUserWishlist = catchAsync(async (req, res, next) => {});

exports.addProductToWishlist = catchAsync(async (req, res, next) => {});

exports.removeProductFromWishlist = catchAsync(async (req, res, next) => {});

exports.getUsersOrder = catchAsync(async (req, res, next) => {});

exports.getOrderById = catchAsync(async (req, res, next) => {});
