const nodemailer = require('nodemailer');

const emailEvent = async (email, subject, message) => {
    try {
        // Create a transporter object with SMTP settings for webmail
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        return  true;
    } catch (error) {
        return false
    }

}

module.exports = emailEvent;