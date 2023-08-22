import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

export type User = {
  provider: string;
  providerId: string;
  emails: string[];
  photos: string[];
  name: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile', 'https://mail.google.com/'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    console.log(accessToken);
    const { emails, photos, id, provider, displayName } = profile;

    const photosFromProfile: Array<string> = [];
    for (const { value: photo } of photos) {
      photosFromProfile.push(photo);
    }
    const emailsFromProfile: Array<string> = [];
    for (const { value: email } of emails) {
      emailsFromProfile.push(email);
    }

    const user = {
      provider: provider,
      providerId: id,
      emails: emailsFromProfile,
      photos: photosFromProfile,
      name: displayName,
    };

    done(null, user);
  }
}
