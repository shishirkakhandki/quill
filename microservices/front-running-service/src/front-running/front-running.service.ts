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
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.rpcUrl,
    );
    this.wallet = new ethers.Wallet(
      this.configService.privateKey,
      this.provider,
    );

    const abi = ['function pause()', 'function unpause()'];

    this.contract = new ethers.Contract(
      this.configService.contractAddress,
      abi,
      this.wallet,
    );

    console.log('Initialized FrontRunningService with:');
    console.log(`Provider: ${this.configService.rpcUrl}`);
    console.log(`Wallet Address: ${this.wallet.address}`);
    console.log(`Contract Address: ${this.configService.contractAddress}`);
  }

  async getAdjustedGasPrice(): Promise<ethers.BigNumber> {
    const gasPrice = await this.provider.getGasPrice();
    console.log(`Current Gas Price: ${gasPrice.toString()}`);
    const adjustedGasPrice = gasPrice
      .mul(ethers.BigNumber.from(110))
      .div(ethers.BigNumber.from(100));
    console.log(`Adjusted Gas Price: ${adjustedGasPrice.toString()}`);
    return adjustedGasPrice;
  }

  async pauseContract(): Promise<void> {
    const gasPrice = await this.getAdjustedGasPrice();
    const tx = {
      gasPrice: gasPrice,
      gasLimit: 100000,
    };

    try {
      console.log('Attempting to pause contract...');
      const txResponse = await this.contract.pause(tx);
      console.log(`Transaction Hash: ${txResponse.hash}`);
      await txResponse.wait();
      console.log('Contract paused successfully');
    } catch (error) {
      console.error('Failed to pause the contract:', error);
      throw error;
    }
  }
}
