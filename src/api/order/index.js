const express = require("express");
const router = express.Router();

const { protect } = require("../_util/middlewares/authMiddlewares");
const OrgUser = require("../../models/OrgUser");
const factory = require("../_util/handlerFactory");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Vendor = require("../../models/Vendor");
const { requiredFields } = require("../_util/check");

const userOrderController = require("./controllers/userOrderController");
const venddorOrderController = require("./controllers/vendorOrderController");
const adminOrderController = require("./controllers/adminOrderController");
const VendorOrder = require("../../models/VendorOrder");

// get user's all orders
router.get("/user", protect(User), userOrderController.getMyOrders);

// create order
router.post("/user", protect(User), userOrderController.createOrderFromCart);

// update order - contact details
router.patch(
  "/:orderId/user-details",
  protect(User),
  requiredFields("address", "mobile"),
  userOrderController.updateUserContactDetails
);

// get order
router.get("/user/:orderId", protect(User), userOrderController.getOrder);

// apply coupon
router.post(
  "/user/:orderId",
  protect(User),
  requiredFields("couponCode"),
  userOrderController.applyCoupon
);

// search orders
router.post(
  "/search",
  protect(OrgUser),
  requiredFields("searchKey"),
  factory.search(Order, "_id")
);

// get vendor's all orders
router.get("/vendor", protect(Vendor), venddorOrderController.getMyOrders);

// get vendor order
router.get(
  "/vendor/:orderId",
  protect(Vendor),
  venddorOrderController.getOrder
);

// update vendor's order status
router.patch(
  "/vendor/:orderId",
  protect(Vendor),
  requiredFields("orderStatus"),
  venddorOrderController.updateOrderStatus
);

// search vendor orders
router.post(
  "/vendor/search",
  requiredFields("searchKey"),
  factory.search(VendorOrder, "_id")
);

// get all orders
router.get("/admin", protect(OrgUser), adminOrderController.getOrders);

// get order
router.get("/admin/:id", protect(OrgUser), factory.getOne(Order, "order"));

module.exports = router;
