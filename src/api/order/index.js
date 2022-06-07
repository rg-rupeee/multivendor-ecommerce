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

// get user's all orders
router.get("/user", protect(User), userOrderController.getMyOrders);

// create order
router.post("/user", protect(User), userOrderController.createOrderFromCart);

// get order
router.get("/user/:orderId", protect(User), userOrderController.getOrder);

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

// get all orders
router.get("/admin", protect(OrgUser), factory.getAll(Order, "order"));

// get order
router.get("/admin/:id", protect(OrgUser), factory.getOne(Order, "order"));

module.exports = router;
