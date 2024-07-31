import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  get mailgunApiKey(): string {
    return this.nestConfigService.get<string>('MAILGUN_API_KEY');
  }

  get mailgunDomain(): string {
    return this.nestConfigService.get<string>('MAILGUN_DOMAIN');
  }

  get email(): string {
    return this.nestConfigService.get<string>('EMAIL');
  }

  get notifyEmail(): string {
    return this.nestConfigService.get<string>('NOTIFY_EMAIL');
  }

  get redisUrl(): string {
    return this.nestConfigService.get<string>('REDIS_URL');
  }
}
