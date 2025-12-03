import { userModel } from "../models/userModel.js";
import { refreshTokenModel } from "../models/refreshTokenModel.js";
import { generateToken } from "../config/jwt.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await userModel.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(userName, email, hashedPassword);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await userModel.getByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken({ userId: user.userId, email: user.email });

    const refreshToken = crypto.randomBytes(64).toString("hex");
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await refreshTokenModel.saveRefreshToken(refreshToken, user.userId, expiryDate);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const storedToken = await refreshTokenModel.getRefreshToken(oldRefreshToken);
    if (!storedToken) {
      return res.status(403).json({ message: "Invalid or expired refresh token." });
    }
    await refreshTokenModel.deleteRefreshToken(oldRefreshToken);

    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await refreshTokenModel.saveRefreshToken(newRefreshToken, storedToken.userId, expiryDate);

    const user = await userModel.getById(storedToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const token = generateToken({ userId: user.userId, email: user.email });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Token refreshed", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await refreshTokenModel.deleteRefreshToken(refreshToken);
    }

    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
