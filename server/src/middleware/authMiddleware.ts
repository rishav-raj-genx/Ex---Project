import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { IUserDocument } from "../models/User.js";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: IUserDocument | false, info: unknown) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            typeof info === "object" && info !== null && "message" in info
              ? String((info as { message: unknown }).message)
              : "Authentication required. Please login.",
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
}

export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate(
    "jwt",
    { session: false },
    (_err: unknown, user: IUserDocument | false) => {
      if (user) {
        req.user = user;
      }
      next();
    }
  )(req, res, next);
}
