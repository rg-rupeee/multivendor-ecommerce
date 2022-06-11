const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const uploadController = require("./controllers/uploadController");
const { protect } = require("../_util/middlewares/authMiddlewares");
const Vendor = require("../../models/Vendor");
const OrgUser = require("../../models/OrgUser");
const User = require("../../models/User");

router.use(
	fileUpload({
		useTempFiles: true,
	})
);

// for single image upload
router.post(
    "/image",
    protect(Vendor,OrgUser,User),
    uploadController.uploadImage
    );

// for multiple images upload
router.post(
    "images",
    protect(Vendor,OrgUser,User),
    uploadController.uploadImages
    );

module.exports = router;