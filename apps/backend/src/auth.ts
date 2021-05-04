import { Response, Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { REFRESH_TOKEN_COOKIE_NAME } from './constants';
import { Device } from './entities/Device';
import { User } from './entities/User';

type GenerateToken = (payload: Parameters<typeof sign>[0]) => string;

export const generateAccessToken: GenerateToken = (payload) => sign(
  payload,
  process.env.ACCESS_TOKEN_SECRET as string,
  {
    expiresIn: '10m',
  },
);

export const generateRefreshToken: GenerateToken = (payload) => sign(
  payload,
  process.env.REFRESH_TOKEN_SECRET as string,
  {
    expiresIn: '1y',
  },
);

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
  });
};

export const generateAccessAndRefreshTokenAndSetCookie = async (userId: User['id'], res: Response) => {
  const { id: deviceUuid } = await Device.create({ userId }).save();
  const payload = { id: userId, deviceUuid };

  setRefreshTokenCookie(res, generateRefreshToken(payload));
  return generateAccessToken(payload);
};

export const verifyAccessTokenAndGetPayload = (req: Request) => {
  if (!req.headers.authorization) throw new Error('No authorization header');
  const token = req.headers.authorization.split(' ')[1];

  return verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const revokeTokens = async (
  userId: number,
  deviceUuid?: string | string[],
): Promise<boolean> => {
  const query = getConnection()
    .createQueryBuilder()
    .delete()
    .from(Device)
    .where('userID = :userId', { userId });

  if (deviceUuid) {
    query.andWhere('id IN(:...deviceUuid)', { deviceUuid: Array.isArray(deviceUuid) ? deviceUuid : [deviceUuid] });
  }

  return !!await query.execute();
};
