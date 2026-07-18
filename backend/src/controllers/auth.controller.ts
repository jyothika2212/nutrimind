import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'nutri_mind_jwt_secret_key_2026_enterprise_level_secure';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'nutri_mind_jwt_refresh_secret_key_2026_enterprise_level_secure';

const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email address already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isFirstAdmin = email.endsWith('@nutrimind.ai') || (await User.countDocuments({})) === 0;
    const finalRole = isFirstAdmin && !role ? 'Admin' : (role || 'User');

    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      isVerified: true, // Auto verify for ease of testing in this project, but token is computed
      verificationToken
    });

    await newUser.save();

    const { accessToken, refreshToken } = generateTokens({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid email or password credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password credentials' });
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        userDetails: user.userDetails
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    jwt.verify(token, JWT_REFRESH_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: 'Refresh token is expired or invalid' });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      });

      res.status(200).json({
        accessToken,
        refreshToken: newRefreshToken
      });
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const requestOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No user account found with this email' });
    }

    // Generate random 6 digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = { code: otpCode, expiresAt };
    await user.save();

    // In production we send this via Nodemailer. For easy testing, print it to the server console:
    console.log(`\n\x1b[35m[OTP ALERT] Send code ${otpCode} to ${email}\x1b[0m\n`);

    res.status(200).json({ message: 'OTP code sent successfully to email (check console logs)' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(400).json({ error: 'OTP request invalid or expired' });
    }

    if (user.otp.code !== otp || new Date() > user.otp.expiresAt) {
      return res.status(400).json({ error: 'OTP is incorrect or has expired' });
    }

    // Clear OTP
    user.otp = undefined;
    await user.save();

    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: 'OTP verification successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const saveProfileDetails = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { userDetails } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.userDetails = {
      ...user.userDetails,
      ...userDetails
    };

    const details = user.userDetails;
    if (details && details.weight && details.height) {
      const heightInMeters = details.height / 100;
      details.bmi = Number((details.weight / (heightInMeters * heightInMeters)).toFixed(2));
      user.userDetails = details;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const googleAuthMock = async (req: Request, res: Response) => {
  try {
    const { name, email, googleId, profilePicture } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        profilePicture,
        role: 'User',
        isVerified: true
      });
      await user.save();
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: 'Google login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    // Verify token using Google's API endpoint (lightweight, zero dependency)
    const tokenVerificationUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const response = await fetch(tokenVerificationUrl);
    if (!response.ok) {
      return res.status(400).json({ error: 'Google ID token verification failed' });
    }

    const payload = (await response.json()) as any;

    // Verify the audience (client ID) if configured
    const client_id = process.env.GOOGLE_CLIENT_ID;
    if (client_id && client_id !== 'YOUR_GOOGLE_CLIENT_ID' && payload.aud !== client_id) {
      return res.status(400).json({ error: 'Token audience does not match client ID' });
    }

    const { email, name, sub: googleId, picture: profilePicture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        profilePicture,
        role: 'User',
        isVerified: true
      });
      await user.save();
    } else {
      // Update googleId and profilePicture if not present
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.profilePicture && profilePicture) {
        user.profilePicture = profilePicture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: 'Google login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        userDetails: user.userDetails
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

