import { RefreshToken } from '@prisma/client';
import dayjs from 'dayjs';
import { client } from '../../prisma/client';
import { GenerateRefreshTokenProvider } from '../../provider/GenerateRefreshTokenProvider';
import { GenerateTokenProvider } from '../../provider/GenerateTokenProvider';

class RefreshTokenUserUseCase {
  async execute(refresh_token: string) {
    const refreshToken: RefreshToken = await client.refreshToken.findFirst({
      where: {
        id: refresh_token,
      },
    });

    if (!refreshToken) {
      throw new Error('Invalid refresh token.');
    }

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expiresIn)
    );

    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(refreshToken.userid);

    if (refreshTokenExpired) {
      await client.refreshToken.deleteMany({
        where: {
          userid: refreshToken.userid,
        },
      });

      const generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
      const newRefreshToken = await generateRefreshTokenProvider.execute(
        refreshToken.userid
      );

      return { token, refreshToken: newRefreshToken };
    }

    return { token };
  }
}

export { RefreshTokenUserUseCase };
