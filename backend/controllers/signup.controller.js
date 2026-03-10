import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import errorHandler from "../utils/error.js";
import crypto from 'crypto'

// ====================== SIGN UP ======================
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// ====================== SIGN IN ======================
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: pwd, ...userData } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .status(200)
      .json(userData);
  } catch (error) {
    next(errorHandler(500, "Server error during signin"));
  }
};

// ====================== GOOGLE AUTH ======================
export const google = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      user = new User({
        username:
          req.body.name.replace(/\s+/g, "").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password, ...userData } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

// ====================== FORGOT PASSWORD ======================
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return next(errorHandler(404, 'User not found'))

    const token = crypto.randomBytes(20).toString('hex')
    const expires = Date.now() + 3600000 // 1 hour

    user.resetPasswordToken = token
    user.resetPasswordExpires = expires
    await user.save()

    // In production you'd email a link to the user. For dev return the link.
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/forgot-password?token=${token}&id=${user._id}`

    return res.status(200).json({ message: 'Reset link created', resetLink })
  } catch (error) {
    next(error)
  }
}

// ====================== RESET PASSWORD ======================
export const resetPassword = async (req, res, next) => {
  const { userId, token, password } = req.body
  try {
    const user = await User.findOne({ _id: userId })
    if (!user) return next(errorHandler(404, 'User not found'))

    if (!user.resetPasswordToken || user.resetPasswordToken !== token) {
      return next(errorHandler(400, 'Invalid or expired token'))
    }
    if (!user.resetPasswordExpires || Date.now() > user.resetPasswordExpires) {
      return next(errorHandler(400, 'Token has expired'))
    }

    const hashed = await bcrypt.hash(password, 10)
    user.password = hashed
    user.resetPasswordToken = null
    user.resetPasswordExpires = null
    await user.save()

    return res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    next(error)
  }
}
