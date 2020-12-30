const mailjet = require("node-mailjet").connect(
  process.env.MAIL_JET_API,
  process.env.MAIL_JET_SECRET
);
const request = mailjet.post("send", { version: "v3.1" }).request({
  Messages: [
    {
      From: {
        Email: "patriotschannelcompany@gmail.com",
        Name: "patriots",
      },
      To: [
        {
          Email: "patriotschannelcompany@gmail.com",
          Name: "patriots",
        },
      ],
      Subject: "Greetings from Mailjet.",
      TextPart: "My first Mailjet email",
      HTMLPart:
        "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      CustomID: "AppGettingStartedTest",
    },
  ],
});
request
  .then((result) => {
    console.log(result.body);
  })
  .catch((err) => {
    console.log(err.statusCode);
  });
