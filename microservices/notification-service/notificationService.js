// const express = require('express');
// const mailgun = require('mailgun-js');
// const axios = require('axios');
// const Bull = require('bull');
// require('dotenv').config();

// const app = express();
// const port = 3000;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Set up Mailgun
// const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

// // Set up message queue
// const queue = new Bull('notificationQueue', process.env.REDIS_URL);

// // Function to send email notification
// const sendEmail = async (subject, text) => {
//     const data = {
//         from: process.env.EMAIL,
//         to: process.env.NOTIFY_EMAIL,
//         subject,
//         text,
//     };

//     try {
//         await mg.messages().send(data);
//         console.log('Email sent:', subject);
//     } catch (error) {
//         console.error('Failed to send email:', error);
//         throw error; // Retry logic in queue will handle this
//     }
// };

// // Process jobs from the queue
// queue.process(async (job) => {
//     const { address, amount } = job.data;
//     try {
//         await sendEmail('Exploit Detected', `Detected from address: ${address}, amount: ${amount}`);
//     } catch (error) {
//         console.error('Failed to process job:', error);
//         throw error; // Retry logic in queue will handle this
//     }
// });

// app.listen(port, () => {
//     console.log(`Notification service listening at http://localhost:${port}`);
// });
