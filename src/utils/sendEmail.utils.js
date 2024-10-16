const nodemailer = require('nodemailer');
const { Config } = require('../configs/config');

exports.sendOTPEmail = async (email, OTP) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pankajsinghbedwal@gmail.com',
        pass: Config.SEND_EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: 'pankajsinghbedwal@gmail.com',
      to: email,
      subject: 'Verify OTP',
      text: `Your otp is: ${OTP}`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error(error);
        reject(false); // Email sending failed
      } else {
        console.log('Email sent: ' + info.response);
        resolve(true); // Email sent successfully
      }
    });
  });
};
