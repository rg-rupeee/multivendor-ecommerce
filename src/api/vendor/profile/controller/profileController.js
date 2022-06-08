const Vendor = require("../../../../models/Vendor");
const catchAsync = require("../../../../utils/catchAsync");

exports.updateProfile = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    return res.status(200).json({
      success: true,
      vendor,
    });
  });
  
exports.getMyProfile = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findById(req.user.id);
  
    return res.status(200).json({
      success: true,
      vendor,
    });
  });