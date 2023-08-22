import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { Profile } from 'passport-google-oauth20';

export const GoogleUser = createParamDecorator(
  (
    data: {
      user: 'GoogleUser';
      key?: keyof Profile;
    } = { user: 'GoogleUser', key: null },
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as Profile;
    const key = data.key as keyof Profile;

    return data.key ? user[key] : user;
  },
);
