const express = require('express');
const Bull = require('bull');
require('dotenv').config();

const app = express();
const port = 6000;

// Middleware to parse JSON bodies
app.use(express.json());

// Set up queues
const notificationQueue = new Bull('notificationQueue', process.env.REDIS_URL);
const frontRunningQueue = new Bull('frontRunningQueue', process.env.REDIS_URL);
const reportingQueue = new Bull('reportingQueue', process.env.REDIS_URL);

// Function to add job to the queue
const addJobToQueue = async (queue, data) => {
    try {
        await queue.add(data);
        console.log('Job added to queue');
    } catch (error) {
        console.error('Failed to add job to queue:', error);
    }
};

// Endpoint to handle exploit detection
app.post('/exploit-detected', async (req, res) => {
    const { address, amount } = req.body;
    if (!address || !amount) {
        return res.status(400).send('Missing address or amount in request body');
    }

    try {
        await Promise.all([
            addJobToQueue(notificationQueue, { address, amount }),
            addJobToQueue(frontRunningQueue, { address, amount }),
            addJobToQueue(reportingQueue, { address, amount })
        ]);
        res.send('Exploit detected and jobs added to queues');
    } catch (error) {
        console.error('Error in adding jobs to queues:', error);
        res.status(500).send('Failed to add jobs to queues');
    }
});

app.listen(port, () => {
    console.log(`Workflow service listening at http://localhost:${port}`);
});
