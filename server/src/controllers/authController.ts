import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User, type IUserDocument } from "../models/User.js";
import { env } from "../config/env.js";

function generateToken(user: IUserDocument): string {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name?.trim()) {
      res.status(400).json({
        success: false,
        message: "Please enter your name",
      });
      return;
    }

    if (!email?.trim()) {
      res.status(400).json({
        success: false,
        message: "Please enter your email address",
      });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please Sign In.",
      });
      return;
    }

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export function login(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  passport.authenticate(
    "local",
    { session: false },
    (
      err: unknown,
      user: IUserDocument | false,
      info: { message?: string } | undefined
    ) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || "Invalid email or password",
        });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  )(req, res, next);
}

export async function getMe(
  req: Request,
  res: Response
): Promise<void> {
  const user = req.user as IUserDocument | undefined;
  if (!user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  res.json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
