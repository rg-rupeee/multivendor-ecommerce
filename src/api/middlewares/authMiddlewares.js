const catchAsync = require("../../utils/catchAsync");

exports.protect = (Model) => {
  return catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("Unauthorized Access. Please provide security token", 401)
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await Model.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("User belonging to this token does not exists", 401)
      );
    }

    req.user = {
      id: currentUser._id,
      phone: currentUser.phone,
      role: currentUser.role,
    };
    next();
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Insufficient Permissions!!!! Forbidden.", 403));
    }
    next();
  };
};
