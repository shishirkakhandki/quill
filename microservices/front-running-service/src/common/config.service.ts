import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get rpcUrl(): string {
    return this.nestConfigService.get<string>('RPC_URL');
  }

  get privateKey(): string {
    return this.nestConfigService.get<string>('PRIVATE_KEY');
  }

  get redisUrl(): string {
    return this.nestConfigService.get<string>('REDIS_URL');
  }

  get contractAddress(): string {
    return this.nestConfigService.get<string>('CONTRACT_ADDRESS');
  }
}
