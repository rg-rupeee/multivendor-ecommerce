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

exports.creatAdminProfile = catchAsync(async (req, res, next) => {
    const orgUser = await OrgUser.findById(req.user.id);

    const isAdmin = false; 
    orgUser.role.forEach(element => {
        if(element == "Admin") 
        isAdmin = true;
    });
  
    if(!isAdmin){
        return next(new AppError("Unauthorized Access",401));
    }

    const neworgUser = new OrgUser(req.body);
    neworgUser.save();

    return res.status(200).json({
      success: true,
      neworgUser,
    });
  });