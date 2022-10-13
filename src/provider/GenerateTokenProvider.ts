import { sign } from 'jsonwebtoken';

class GenerateTokenProvider {
  async execute(userid: string) {
    const token = sign({}, '33779428-f03f-4f4f-929d-b1db7d8441d0', {
      subject: userid,
      expiresIn: '20s',
    });

    return token;
  }
}

export { GenerateTokenProvider };
