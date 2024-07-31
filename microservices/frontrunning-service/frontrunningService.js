const express = require('express');
const { ethers } = require('ethers');
const Bull = require('bull');
require('dotenv').config();

const app = express();
const port = 4000;

// Set up provider and signer
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract details
const contractAddress = '0x498469ca0af948344f6c08bd880ae59daad01c20';
const abi = [
    "function pause() external",
    "function unpause() external",
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

// Set up queue
const queue = new Bull('frontRunningQueue', process.env.REDIS_URL);

// Function to get current gas price with adjustment
const getAdjustedGasPrice = async () => {
    const gasPrice = await provider.getGasPrice();
    const adjustedGasPrice = gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100)); // Increase gas price by 10%
    return adjustedGasPrice;
};

// Function to pause the contract
const pauseContract = async () => {
    const gasPrice = await getAdjustedGasPrice();
    const tx = {
        gasPrice: gasPrice,
        gasLimit: 100000, // Adjust gas limit as needed
    };

    try {
        const txResponse = await contract.pause(tx);
        await txResponse.wait();
        console.log('Contract paused successfully');
    } catch (error) {
        console.error('Failed to pause the contract:', error);
    }
};

// Process jobs from the queue
queue.process(async (job) => {
    const { address, amount } = job.data;
    try {
        await pauseContract();
        console.log('Contract paused for address:', address);
    } catch (error) {
        console.error('Failed to process job:', error);
        throw error; // Retry logic in queue will handle this
    }
});

app.listen(port, () => {
    console.log(`Front-running service listening at http://localhost:${port}`);
});
