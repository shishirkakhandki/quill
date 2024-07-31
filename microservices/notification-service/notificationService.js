const express = require('express');
const nodemailer = require('nodemailer');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const port = 3000;

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Function to send email notification
const sendEmail = (subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.NOTIFY_EMAIL,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

// Listen for exploit detection
app.post('/exploit-detected', (req, res) => {
    const { address, amount } = req.body;
    sendEmail('Exploit Detected', `Exploit detected from address: ${address}, amount: ${amount}`);
    res.send('Notification sent');
});

app.listen(port, () => {
    console.log(`Notification service listening at http://localhost:${port}`);
});
