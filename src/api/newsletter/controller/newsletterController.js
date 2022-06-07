const catchAsync = require("../../../utils/catchAsync");
const factory = require("../../_util/handlerFactory")
const { sendMail } = require("../../../utils/email")

exports.sendNewsLetter = catchAsync(async(req,res,next) =>{
    const htmlContent = req.body;

    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const newsletters = await features.query;

    for (let index = 0; index < newsletters.length; index++) {
        const element = array[index];
        const email = element.email;

        await sendMail(email ,
             "Here is a Newsletter for you",
             htmlContent);
    }

    return res.json({
        status: "success",
        message: "NewsLetters are sent successfully",
      });
})