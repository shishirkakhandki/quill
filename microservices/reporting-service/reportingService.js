const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const exploitSchema = new mongoose.Schema({
    address: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now },
});

const Exploit = mongoose.model('Exploit', exploitSchema);

// Set up queue
const queue = new Bull('reportingQueue', process.env.REDIS_URL);

// Function to save exploit to database
const saveExploit = async (address, amount) => {
    const exploit = new Exploit({ address, amount });
    try {
        await exploit.save();
        console.log('Exploit saved to database');
    } catch (error) {
        console.error('Failed to save exploit:', error);
        throw error; // Retry logic in queue will handle this
    }
};

// Process jobs from the queue
queue.process(async (job) => {
    const { address, amount } = job.data;
    try {
        await saveExploit(address, amount);
    } catch (error) {
        console.error('Failed to process job:', error);
        throw error; // Retry logic in queue will handle this
    }
});

app.listen(port, () => {
    console.log(`Reporting service listening at http://localhost:${port}`);
});
