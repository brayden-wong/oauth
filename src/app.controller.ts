import {
  Controller,
  Get,
  Inject,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GoogleUser } from './google.user.decorator';
import { GoogleGuard } from './google.guard';
import { ConfigService } from '@nestjs/config';
import { Database, InjectDrizzle } from './drizzle.module';
import { users } from './schema';
import { User } from './google.strategy';
import { eq } from 'drizzle-orm';

@Controller()
export class AppController {
  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @InjectDrizzle() private readonly db: Database,
  ) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {}

  @Redirect('http://localhost:3000', 200)
  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@GoogleUser() user: User) {
    await this.db.transaction(async (tx) => {
      const [exists] = await tx
        .select()
        .from(users)
        .where(eq(users.providerId, user.providerId))
        .limit(1);

      if (!exists) await tx.insert(users).values(user);

      return;
    });
  }
}
