const nodemailer = require('nodemailer');

const sendAdminNotification = async (subject, message) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log("Email credentials not set in .env. Skipping email notification.");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // App Password
            },
        });

        const mailOptions = {
            from: `LOGS=SALES System <${process.env.EMAIL_USER}>`,
            to: 'afaceabolade@gmail.com', // Admin email
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to afaceabolade@gmail.com: ${subject}`);
    } catch (error) {
        console.error('Failed to send email notification:', error.message);
    }
};

module.exports = sendAdminNotification;
