import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '../common/config.service';

@Injectable()
export class FrontRunningService implements OnModuleInit {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.provider = new ethers.providers.JsonRpcProvider(this.configService.rpcUrl);
    this.wallet = new ethers.Wallet(this.configService.privateKey, this.provider);

    const abi = [
      "function pause() external",
      "function unpause() external",
    ];

    this.contract = new ethers.Contract(this.configService.contractAddress, abi, this.wallet);
  }

  async getAdjustedGasPrice(): Promise<ethers.BigNumber> {
    const gasPrice = await this.provider.getGasPrice();
    return gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100)); // Increase gas price by 10%
  }

  async pauseContract(): Promise<void> {
    const gasPrice = await this.getAdjustedGasPrice();
    const tx = {
      gasPrice: gasPrice,
      gasLimit: 100000, // Adjust gas limit as needed
    };

    try {
      const txResponse = await this.contract.pause(tx);
      await txResponse.wait();
      console.log('Contract paused successfully');
    } catch (error) {
      console.error('Failed to pause the contract:', error);
      throw error;
    }
  }
}
