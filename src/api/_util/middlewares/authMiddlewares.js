const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");

exports.protect = (...models) => {
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

    for (var i = 0; i < models.length; i++) {
      let model = models[i];
      let currentUser = await model.findById(decoded.id);
      // console.log(currentUser);
      // console.log(currentUser != null);
      if (currentUser != null) {
        req.user = {
          id: currentUser._id,
          role: currentUser.role,
        };
        return next();
      }
    }

    return next(
      new AppError("User belonging to this token does not exists", 401)
    );
  });
};

exports.optionalProtect = (...models) => {
  return catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // if token not present means user not logged in
    if (!token) {
      return next();
    }

    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
      return next();
    }

    for (var i = 0; i < models.length; i++) {
      let model = models[i];
      let currentUser = await model.findById(decoded.id);
      // console.log(currentUser);
      // console.log(currentUser != null);
      if (currentUser != null) {
        req.user = {
          id: currentUser._id,
          role: currentUser.role,
        };
        return next();
      }
    }

    return next();
  });
};

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     console.log(req.user);
//     console.log(roles);
//     console.log(roles.includes(req.user.role));
//     if (!roles.includes(req.user.role)) {
//       return next(new AppError("Insufficient Permissions!!!! Forbidden.", 403));
//     }
//     next();
//   };
// };
