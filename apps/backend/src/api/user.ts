import { Request, Response } from 'express';
import argon2 from 'argon2';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import {
  generateAccessAndRefreshTokenAndSetCookie, generateAccessToken, generateRefreshToken, revokeTokens, setRefreshTokenCookie, verifyAccessTokenAndGetPayload,
} from '../auth';
import { User } from '../entities/User';
import { Device } from '../entities/Device';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants';

export async function signUp(req: Request, res: Response) {
  try {
    const {
      username, email, password, name,
    } = req.body;
    const hashedPassword = await argon2.hash(password);

    const user = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
    }).save();

    res.send({
      success: true,
      accessToken: await generateAccessAndRefreshTokenAndSetCookie(user.id, res),
      user: {
        username,
        name,
        email,
      },
    });
  } catch (error) {
    res.status(400).send({ success: false, error });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    // @ts-ignore
    const { id, deviceUuid } = verifyAccessTokenAndGetPayload(req);

    await revokeTokens(id, deviceUuid);
  } catch (error) {
    console.log(error);
  }

  res.send({ success: true });
}

export async function login(req: Request, res: Response) {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({
      where: [
        { email: usernameOrEmail },
        { username: usernameOrEmail },
      ],
    });

    if (user && await argon2.verify(user.password, password)) {
      const { password, ...rest } = user;
      const accessToken = await generateAccessAndRefreshTokenAndSetCookie(user.id, res) ?? null;

      res.send({
        success: true,
        accessToken,
        user: rest,
        error: null,
      });

      res.end();
    }
  } catch (error) {
    res.status(400).send({ success: false, error }).end();
  }
  res.status(400).send({ success: false, error: 'User doesn\'t exist.', accessToken: null });
}

export async function refreshToken(req, res) {
  const token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  try {
    const { id, deviceUuid } = verify(
      token, process.env.REFRESH_TOKEN_SECRET as string,
    );
    const payload = { id, deviceUuid };

    await getRepository(User)
      .createQueryBuilder('u')
      .leftJoin(Device, 'd', 'd.userId = u.id')
      .where('u.id = :id', { id })
      .andWhere('d.id = :deviceUuid', { deviceUuid })
      .getOneOrFail();

    setRefreshTokenCookie(res, generateRefreshToken(payload));
    return res.send({
      success: true,
      accessToken: generateAccessToken(payload),
    });
  } catch (err) {
    return res.send({
      success: false,
      accessToken: null,
    });
  }
}
