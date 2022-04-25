const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/appError");
const Wishlist = require("../../../../models/Wishlist");

const _getWishlist = async (userId, populate) => {
  let wishlist;
  if (populate == "true") {
    wishlist = await Wishlist.findOne({ userId }).populate("products");
  } else {
    wishlist = await Wishlist.findOne({ userId });
  }

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, products: [] });
  }

  return wishlist;
};

exports.getMyWishlist = catchAsync(async (req, res, next) => {
  const { populate } = req.query;

  const wishlist = await _getWishlist(req.user.id, populate);

  return res.json({
    status: "success",
    wishlist,
  });
});

exports.addProductToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await _getWishlist(req.user.id);

  if (wishlist.products.includes(productId)) {
    return res.json({
      status: "success",
      wishlist,
    });
  }

  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user.id },
    { $push: { products: productId } },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.json({
    status: "success",
    wishlist: updatedWishlist,
  });
});

exports.removeProductFromWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await _getWishlist(req.user.id);

  if (!wishlist.products.includes(productId)) {
    return res.json({
      status: "success",
      wishlist,
    });
  }

  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { products: productId } },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.json({
    status: "success",
    wishlist: updatedWishlist,
  });
});

exports.checkProductInWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const wishlist = await _getWishlist(req.user.id);

  if (wishlist.products.includes(productId)) {
    return res.json({
      status: "success",
      productId,
      exists: true,
    });
  }

  return res.json({
    status: "success",
    productId,
    exists: false,
  });
});

exports.checkMultipleProductInWishlist = catchAsync(async (req, res, next) => {
  const { products } = req.body;

  const wishlist = await _getWishlist(req.user.id);

  const data = [];
  for (const product of products) {
    if (wishlist.products.includes(product)) {
      data.push({
        productId: product,
        exists: true,
      });
    } else {
      data.push({
        productId: product,
        exists: false,
      });
    }
  }

  return res.json({
    status: "success",
    data,
  });
});
