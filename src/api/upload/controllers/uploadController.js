const cloudinary = require("cloudinary").v2;
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");

exports.uploadImage = catchAsync(async (req, res, next) => {
	if (!req.files) {
		return next(new AppError("Please upload File", 400));
	}
	if (!req.body.path) {
		return next(new AppError("Please provide file path", 400));
	}
	// console.log(req.files);
	const file = req.files.image;

	const result = await cloudinary.uploader.upload(file.tempFilePath, {
		folder: req.body.path,
	});

	return res.json({
		succes: true,
		result,
	});
});

exports.uploadImages = catchAsync(async (req, res, next) => {
	if (!req.files) {
		return next(new AppError("Please upload File", 400));
	}
	if (!req.body.path) {
		return next(new AppError("Please provide file path", 400));
	}
	const files = req.files.images;

	const result = [];
	for (const file of files) {
		const res = await cloudinary.uploader.upload(file.tempFilePath, {
			folder: req.body.path,
		});
		result.push(res);
	}

	return res.json({
		succes: true,
		result,
	});
});
