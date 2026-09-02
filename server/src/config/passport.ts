import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User, type IUserDocument } from "../models/User.js";
import { env } from "./env.js";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function configurePassport(): void {
  // Local Strategy for email/password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase().trim() });
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // JWT Strategy for token verification on protected routes
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwtSecret,
  };

  passport.use(
    new JwtStrategy(jwtOptions, async (payload: JwtPayload, done) => {
      try {
        const user = await User.findById(payload.id).select("-password");
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    })
  );
}

export type { IUserDocument };
