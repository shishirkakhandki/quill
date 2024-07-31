const express = require('express');
const { ethers } = require('ethers');
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

// Middleware to parse JSON bodies
app.use(express.json());

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

// Endpoint to handle requests from the queue
app.post('/pause-contract', async (req, res) => {
    try {
        await pauseContract();
        res.send('Contract paused');
    } catch (error) {
        console.error('Failed to pause the contract:', error);
        res.status(500).send('Failed to pause the contract');
    }
});

app.listen(port, () => {
    console.log(`Front-running service listening at http://localhost:${port}`);
});
