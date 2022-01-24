const nodemailer                          = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: `hoanganlxt666666@gmail.com`,
        pass: `phamhoangan131299`
    }
});


module.exports = transporter;