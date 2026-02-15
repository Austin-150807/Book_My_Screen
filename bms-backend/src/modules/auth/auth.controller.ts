import { Request, Response, NextFunction } from "express";
import * as OtpService from "./otp.service";
import * as UserService from "../user/user.service";
import * as TokenService from "./token.service";
import createHttpError from "http-errors";
import { isValidEmail } from "../../utils";
import { IUser } from "../user/user.interface";

/* =========================
   SEND OTP
========================= */
export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(createHttpError(400, "Email is required"));
    }

    if (!isValidEmail(email)) {
      return next(createHttpError(400, "Invalid email format"));
    }

    const otp = OtpService.generateOTP();

    const ttl = 1000 * 60 * 2; // 2 mins
    const expires = Date.now() + ttl;
    const data = `${email}.${otp}.${expires}`;
    const hashedOTP = OtpService.hashOTP(data);

    await OtpService.sendOTPtoEmail(email, otp);

    res.json({
      hash: `${hashedOTP}.${expires}`,
      email,
      msg: "OTP sent successfully",
    });
  } catch (error) {
    console.log("🔥 SEND OTP ERROR:", error);
    next(error);
  }
};

/* =========================
   VERIFY OTP
========================= */
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, hash } = req.body;

    console.log("📩 EMAIL:", email);
    console.log("🔢 OTP:", otp);
    console.log("🔐 HASH:", hash);

    if (!email || !otp || !hash) {
      return next(createHttpError(400, "All fields are required"));
    }

    const parts = hash.split(".");
    if (parts.length !== 2) {
      return next(createHttpError(400, "Invalid hash format"));
    }

    const [hashedOTP, expires] = parts;

    console.log("⏳ EXPIRES:", expires);
    console.log("🕒 NOW:", Date.now());

    if (Date.now() > Number(expires)) {
      return next(createHttpError(410, "OTP Expired"));
    }

    const data = `${email}.${otp}.${expires}`;
    const isValid = OtpService.verifyOTP(hashedOTP, data);

    if (!isValid) {
      return next(createHttpError(401, "Invalid OTP"));
    }

    let user = await UserService.getUserByEmail(email);

    if (!user) {
      user = await UserService.createUser({ email } as IUser);
    }

    if (!user || !user._id) {
      return next(createHttpError(500, "User creation failed"));
    }

    const { accessToken, refreshToken } =
      TokenService.generateToken({
        _id: user._id,
        email: user.email,
      });

    await TokenService.storeRefreshToken(
      user._id.toString(),
      refreshToken
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({
      auth: true,
      user,
    });

  } catch (error) {
    console.log("🔥 VERIFY OTP ERROR:", error);
    next(error);
  }
};

/* =========================
   LOGOUT
========================= */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await TokenService.deleteRefreshToken(refreshToken);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ msg: "Logged out successfully" });
  } catch (error) {
    console.log("🔥 LOGOUT ERROR:", error);
    next(error);
  }
};
