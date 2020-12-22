"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(message) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(process.env.GMAIL);

  // send mail with defined transport object
  let info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = sendEmail;
