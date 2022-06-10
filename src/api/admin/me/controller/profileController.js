const OrgUser = require("../../../../models/OrgUser");
const AppError = require("../../../../utils/appError");
const catchAsync = require("../../../../utils/catchAsync");

exports.updateProfile = catchAsync(async (req, res, next) => {
  const orgUser = await OrgUser.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    orgUser,
  });
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
  const orgUser = await OrgUser.findById(req.user.id);

  return res.status(200).json({
    success: true,
    orgUser,
  });
});
