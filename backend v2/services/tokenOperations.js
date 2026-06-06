import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export function generateAccessToken(id, name) {
  const accessToken = jwt.sign(
    {
      uid: id,
      name: name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  return accessToken;
}

export function generateRefreshToken(id, name) {
  const jtid = uuidv4();
  const refreshToken = jwt.sign(
    {
      uid: id,
      name: name,
      jti: jtid,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return { refreshToken, jtid };
}

export function decodeToken(token) {
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  return decoded;
}
