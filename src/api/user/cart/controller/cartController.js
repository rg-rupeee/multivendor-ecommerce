const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/AppError");
const Cart = require("../../../../models/Cart");
const Product = require("../../../../models/Product");

const validateCart = async (userId) => {
  let cart = await Cart.findOne({ userId }).populate(
    "products.productId",
    "_id name mrp offeredPrice quantityInStock"
  );
  if (!cart) {
    cart = await Cart.create({ userId, products: [] });
  }

  let needsUpdate = false;
  const updatedProducts = [];
  for (const product of cart.products) {
    if (product.quantity > product.productId.quantityInStock) {
      needsUpdate = true;
      updatedProducts.push({
        productId: product.productId._id,
        quantity: product.productId.quantityInStock,
      });
    } else {
      updatedProducts.push({
        productId: product.productId._id,
        quantity: product.quantity,
      });
    }
  }

  if (needsUpdate) {
    await Cart.findOneAndUpdate(
      { userId },
      { products: updatedProducts },
      { runValidators: true }
    );
  }
};

const _getCart = async (userId, populate) => {
  let cart;

  await validateCart(userId);

  if (populate == "true") {
    cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "_id name mrp offeredPrice quantityInStock"
    );
  } else {
    cart = await Cart.findOne({ userId });
  }

  return cart;
};

const _removeProductFromCart = async (cart, productId, userId) => {
  if (!cart.products.some((obj) => obj.productId.equals(productId))) {
    return cart;
  }

  const updatedCart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { products: { productId } } },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedCart;
};

const _updateProductQuantityInCart = async (
  cart,
  productId,
  quantity,
  userId
) => {
  let updatedCart;

  if (quantity == 0) {
    /* if product quantity is 0 remove item from cart */
    updatedCart = await _removeProductFromCart(cart, productId, userId);
  } else {
    if (!cart.products.some((obj) => obj.productId.equals(productId))) {
      updatedCart = await Cart.findOneAndUpdate(
        { userId },
        { $push: { products: { productId, quantity } } },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      updatedCart = await Cart.findOneAndUpdate(
        { userId, "products.productId": productId },
        { $set: { "products.$.quantity": quantity } },
        {
          new: true,
          runValidators: true,
        }
      );
    }
  }

  return updatedCart;
};

exports.getMyCart = catchAsync(async (req, res, next) => {
  const { populate } = req.query;
  const cart = await _getCart(req.user.id, populate);

  return res.json({
    status: "success",
    cart,
  });
});

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await _getCart(req.user.id);

  const updatedCart = await _removeProductFromCart(
    cart,
    productId,
    req.user.id
  );

  return res.json({
    status: "success",
    cart: updatedCart,
  });
});

exports.updateProductQuantityInCart = catchAsync(async (req, res, next) => {
  let { productId, quantity } = req.params;

  quantity = parseInt(quantity);

  if (quantity < 0) {
    return next(new AppError(`Quantity cannot be a negetive product`, 400));
  }

  console.log({ productId, quantity });

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    return next(
      new AppError(`Cannot find the product with id ${productId}`, 400)
    );
  }
  if (product.quantityInStock < quantity) {
    return next(
      new AppError(
        `Cannot add product to cart. Maximum quantity = ${product.quantityInStock}`
      )
    );
  }

  const cart = await _getCart(req.user.id);

  if (quantity < 0) {
    return next(new AppError("Quantity cannot be less than 0", 400));
  }

  let updatedCart = await _updateProductQuantityInCart(
    cart,
    productId,
    quantity,
    req.user.id
  );

  return res.json({
    status: "success",
    cart: updatedCart,
  });
});