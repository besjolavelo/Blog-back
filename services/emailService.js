
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'besjolavelo@gmail.com', // Your Gmail address
    pass: 'rild vroz xotp cuzu',  // Your Gmail password
  },
});

module.exports = transporter;
