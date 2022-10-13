import dayjs from 'dayjs';
import { client } from '../prisma/client';

class GenerateRefreshTokenProvider {
  async execute(userid: string) {
    const expiresIn = dayjs().add(15, 'second').unix();

    const generateRefreshToken = await client.refreshToken.create({
      data: {
        userid,
        expiresIn,
      },
    });

    return generateRefreshToken;
  }
}

export { GenerateRefreshTokenProvider };
