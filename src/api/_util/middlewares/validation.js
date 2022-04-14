const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");

exports.validatePassword = catchAsync(async (req, res, next) => {
  if (req.body.password.length < 8) {
    return next(new AppError("Password must be of atleast 8 characters", 400));
  }

  next();
});
