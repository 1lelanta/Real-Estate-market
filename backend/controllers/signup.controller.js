import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import errorHandler from "../utils/error.js";

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
