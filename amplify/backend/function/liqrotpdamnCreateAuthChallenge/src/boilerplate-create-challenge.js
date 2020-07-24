/* tslint:disable */
/* eslint-disable */

// exports.handler = (event, context) => {
//   if (event.request.session.length === 2 && event.request.challengeName === 'CUSTOM_CHALLENGE') {
//     event.response.publicChallengeParameters = { trigger: 'true' };

//     event.response.privateChallengeParameters = {};
//     event.response.privateChallengeParameters.answer = process.env.CHALLENGEANSWER;
//   }
//   context.done(null, event);
// };
const AWS = require("aws-sdk");
exports.handler = (event, context, callback) => {
  //Create a random number for otp
  const challengeAnswer = Math.random()
    .toString(10)
    .substr(2, 6);
  const phoneNumber = event.request.userAttributes.phone_number; //sns sms
  const sns = new AWS.SNS({ region: "ap-south-1" });
  sns.publish(
    {
      Message: "Your OTP for logging in to the LiQR associated restaurant is : " + challengeAnswer,
      PhoneNumber: phoneNumber,
      MessageStructure: "string",
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: "AMPLIFY",
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    },
    function(err, data) {
      if (err) {
        console.log(err.stack);
        console.log(data);
        return;
      }
      return data;
    }
  ); //set return params
  event.response.privateChallengeParameters = {};
  event.response.privateChallengeParameters.answer = challengeAnswer;
  event.response.challengeMetadata = "CUSTOM_CHALLENGE";
  callback(null, event);
};
