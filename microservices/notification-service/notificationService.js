const express = require('express');
const mailgun = require('mailgun-js');
const axios = require('axios');
const { Queue } = require('bull');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Set up Mailgun
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

// Set up message queue
const queue = new Queue('exploitQueue', process.env.REDIS_URL);

// Function to send email notification
const sendEmail = (subject, text) => {
    const data = {
        from: process.env.EMAIL,
        to: process.env.NOTIFY_EMAIL,
        subject,
        text,
    };

    mg.messages().send(data, (error, body) => {
        if (error) {
            console.error('Failed to send email:', error);
        } else {
            console.log('Email sent: ' + body.message);
        }
    });
};

// Function to notify front-running service
const notifyFrontRunningService = async (address, amount) => {
    try {
        await axios.post(process.env.FRONT_RUNNING_SERVICE_URL, {
            address,
            amount
        });
        console.log('Notified front-running service');
    } catch (error) {
        console.error('Failed to notify front-running service:', error);
    }
};

// Function to add task to queue
const addToQueue = async (address, amount) => {
    try {
        await queue.add({ address, amount });
        console.log('Task added to queue');
    } catch (error) {
        console.error('Failed to add task to queue:', error);
    }
};

// Listen for exploit detection
app.post('/exploit-detected', (req, res) => {
    const { address, amount } = req.body;
    if (!address || !amount) {
        return res.status(400).send('Missing address or amount in request body');
    }
    sendEmail('Exploit Detected', `Detected from address: ${address}, amount: ${amount}`);
    addToQueue(address, amount); // Add to queue instead of notifying immediately
    res.send('Notification sent');
});

app.listen(port, () => {
    console.log(`Notification service listening at http://localhost:${port}`);
});
