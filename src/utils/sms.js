const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const fromMobileNo = process.env.CONTACT_NO;

exports.sendMessage = async (mobileNo, body) => {
  if (typeof mobileNo !== "string") mobileNo = mobileNo.toString();

  if (mobileNo.length == 10) mobileNo = "+91" + mobileNo;

  console.log({ mobileNo, body });

  client.messages
    .create({
      body,
      from: fromMobileNo,
      to: mobileNo,
    })
    .then((message) => console.log("message sent " + message.sid))
    .catch((err) => console.log(err));
};
