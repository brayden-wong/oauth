import { Controller, Get, Inject, Res, UseGuards } from '@nestjs/common';
import { GoogleUser } from './google.user.decorator';
import { GoogleGuard } from './google.guard';
import { ConfigService } from '@nestjs/config';
import { Database, InjectDrizzle } from './drizzle.module';
import { users } from './schema';
import { User } from './google.strategy';
import { eq } from 'drizzle-orm';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @InjectDrizzle() private readonly db: Database,
  ) {}

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Res() res: Response, @GoogleUser() user: User) {
    await this.db.transaction(async (tx) => {
      const [exists] = await tx
        .select()
        .from(users)
        .where(eq(users.providerId, user.providerId))
        .limit(1);

      if (!exists) await tx.insert(users).values(user);

      return;
    });

    return res
      .status(200)
      .redirect(
        `http://localhost:3000/emails?email=${user.emails[0]}&accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`,
      );
  }
}
