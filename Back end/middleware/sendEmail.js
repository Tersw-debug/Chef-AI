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
        html:`<p>Please verify your email by clicking the button below:</p>
                <a href="${options.message}" 
                    style="padding:10px 15px;background:#007bff;color:white;text-decoration:none;border-radius:5px;">
                    Verify Email
                </a>
            `
    };

    await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;