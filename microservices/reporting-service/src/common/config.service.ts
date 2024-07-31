import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get mongoUri(): string {
    return this.nestConfigService.get<string>('MONGO_URI');
  }

  get redisUrl(): string {
    return this.nestConfigService.get<string>('REDIS_URL');
  }
}
