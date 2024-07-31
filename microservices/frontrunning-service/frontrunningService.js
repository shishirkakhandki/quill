const { ethers } = require('ethers');
require('dotenv').config();

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

const monitorAndPause = async () => {
    provider.on('pending', async (tx) => {
        try {
            const transaction = await provider.getTransaction(tx);

            if (transaction.to === contractAddress) {
                await contract.pause();
                console.log('Contract paused due to suspicious activity');
            }
        } catch (error) {
            console.error(error);
        }
    });
};

monitorAndPause();
