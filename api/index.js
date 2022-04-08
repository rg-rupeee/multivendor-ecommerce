const express = require("express");
const router = express.Router();

router.use("/test", (req, res, next) => {
  res.json({
    status: "success",
    message: "Hello from server",
  });
});

module.exports = router;
