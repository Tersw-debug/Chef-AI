const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service:process.env.EMAIL_SERVICE,
        auth: {
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.EMAIL_USERNAME}>`,
        to:options.email,
        subject:options.subject,
        html:options.message
    };

    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;