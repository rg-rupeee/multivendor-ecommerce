const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { createSendToken } = require("./token");

exports.emailSignin = (Model) =>
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await Model.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("User does not exists", 400));
    }

    console.log({ user, password });

    if (!(await user.correctPassword(password, user.password))) {
      return next(new AppError("Invalid Password", 401));
    }

    createSendToken(user, 200, req, res);
  });

exports.changePassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    const user = await Model.findById(req.user.id).select("+password");

    if (!(await user.correctPassword(oldPassword, user.password))) {
      return next(new AppError("Invalid Password", 401));
    }

    // need to user .save() so that pre save middleware executes and hashing of password is done
    user.password = newPassword;
    await user.save();

    user.password = undefined;

    return res.status(200).json({
      success: true,
      user,
    });
  });
