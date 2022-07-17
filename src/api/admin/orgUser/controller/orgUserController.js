const OrgUser = require("../../../../models/OrgUser");
const AppError = require("../../../../utils/appError");
const catchAsync = require("../../../../utils/catchAsync");

exports.createOrgUser = catchAsync(async (req, res, next) => {
  const orgUser = await OrgUser.findById(req.user.id);

  let isAdmin = false;
  orgUser.role.forEach((element) => {
    if (element == "Admin") isAdmin = true;
  });

  if (!isAdmin) {
    return next(
      new AppError("Unauthorized Access! Only Admin can create orguser", 403)
    );
  }

  const tempOrgUser = await OrgUser.findOne({ email: req.body.email });

  if (tempOrgUser != null)
    return next(new AppError("User with this email already exits", 409));

  const neworgUser = new OrgUser(req.body);

  await neworgUser.save();

  return res.status(200).json({
    success: true,
    neworgUser,
  });
});
