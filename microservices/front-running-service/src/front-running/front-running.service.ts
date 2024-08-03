import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '../common/config.service';

@Injectable()
export class FrontRunningService implements OnModuleInit {
  private readonly logger = new Logger(FrontRunningService.name);
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

    const abi = ['function pauseContract()', 'function unpauseContract()'];

    this.contract = new ethers.Contract(
      this.configService.contractAddress,
      abi,
      this.wallet,
    );

    this.logger.log('Initialized FrontRunningService with:');
    this.logger.log(`Provider: ${this.configService.rpcUrl}`);
    this.logger.log(`Wallet Address: ${this.wallet.address}`);
    this.logger.log(`Contract Address: ${this.configService.contractAddress}`);
  }

  async getAdjustedGasPrice(): Promise<ethers.BigNumber> {
    const gasPrice = await this.provider.getGasPrice();
    this.logger.log(`Current Gas Price: ${gasPrice.toString()}`);
    const adjustedGasPrice = gasPrice
      .mul(ethers.BigNumber.from(110))
      .div(ethers.BigNumber.from(100));
    this.logger.log(`Adjusted Gas Price: ${adjustedGasPrice.toString()}`);
    return adjustedGasPrice;
  }

  async pauseContract(): Promise<void> {
    const gasPrice = await this.getAdjustedGasPrice();
    const tx = {
      gasPrice: gasPrice,
      gasLimit: 200000,
    };

    try {
      this.logger.log('Attempting to pause contract...');
      const txResponse = await this.contract.pauseContract(tx);
      this.logger.log(`Transaction Hash: ${txResponse.hash}`);
      await txResponse.wait();
      this.logger.log('Contract paused successfully');
    } catch (error) {
      this.logger.error('Failed to pause the contract:', error);
      throw error;
    }
  }
}
