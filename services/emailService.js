const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other services like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

exports.sendNotification = (poll) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'user@example.com', // Replace with dynamic recipient email
            subject: 'New Vote Received',
            text: `A new vote has been received for your poll: "${poll.question}". Current results: ${poll.options
                .map(option => `${option.text}: ${option.votes} votes`)
                .join(', ')}`,
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    };
    