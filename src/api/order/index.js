const express = require("express");
const router = express.Router();

const { protect } = require("../_util/middlewares/authMiddlewares");
const OrgUser = require("../../models/OrgUser");
const factory = require("../_util/handlerFactory");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Vendor = require("../../models/Vendor");

// get user's all orders
router.get("/user", protect(User));

// create order
router.post("/user", protect(User));

// get order
router.get("/user/:orderId", protect(User));

// get vendor's all orders
router.get("/vendor", protect(Vendor));

// update vendor's order status
router.patch("/vendor/:orderId/status", protect(Vendor));

// get all orders
router.get("/admin", protect(OrgUser), factory.getAll(Order, "order"));

// get order
router.get("/admin/:id", protect(OrgUser), factory.getOne(Order, "order"));

module.exports = router;
