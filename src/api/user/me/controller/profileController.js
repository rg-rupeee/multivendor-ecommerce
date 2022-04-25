const catchAsync = require("../../../../utils/catchAsync");
const User = require("../../../../models/User");

exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    user,
  });
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  return res.status(200).json({
    success: true,
    user,
  });
});
