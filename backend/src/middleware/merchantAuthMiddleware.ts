import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import cookie from "cookie";
import { verifyToken, verifyTokenMerchant } from "../utils/jwtUtils";

export interface AuthRequest extends Request {
  user?: any;
}

export function adminMerchant(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const cookies = req.headers.cookie;

  if (!cookies) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const parsedCookies = cookie.parse(cookies);
  const token = parsedCookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const payload = verifyTokenMerchant(token) as JwtPayload;

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
