import { Request, Response } from "express";
import argon2 from "argon2";
import { User } from "../models/userModel.js";
import jwt from 'jsonwebtoken';





const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })

    if (existingUser) {
      res.status(400).json({ message: "User already existing with this email or username" });
    } else {
      const hashedPassword = await argon2.hash(password)

      const newUser = new User({
        username,
        email,
        password: hashedPassword
      })

      await newUser.save()

      res.status(200).json({ message: "User created successfully" });
    }

  } catch (error) {
    console.log("error occured in register...", error);
    res.status(500).json({ message: "Server error during registration" });
  }
}



const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      res.status(400).json({ message: "User not exist" });
    } else {
      const isMatch = await argon2.verify(user.password, password)

      if (!isMatch) {
        res.status(400).json({ message: "Password didnt match" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' })

      res.status(200).json({
        message: 'Login successful',
        token,
        user
      });
    }


  } catch (error) {
    console.log("Error occured in login", error);
    res.status(500).json({ message: 'Server error' });
  }
}


const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.id as string;
    const user = await User.findOne(
      { _id: userId },
      { username: 1, email: 1, _id: 0, image: 1 }
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      username: user.username,
      email: user.email,
      image: user.image || null
    });

  } catch (error) {
    console.error("Error in get user:", error);
    res.status(500).json({ message: 'Server error' });
  }
};




const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.query.id;
    const image = req.file?.filename;
    // console.log('File received:', req.file);
    // console.log('User ID:', req.query.id);
    await User.updateOne({ _id: id }, { $set: { image } });
    res.json({ message: "Image added" });
  } catch (error) {
    console.error("Error in upload image:", error);
    res.status(500).json({ message: 'Server error' });
  }
}


const updateProfile = async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const { username, email, password } = req.body;

    const update: any = { username, email };
    if (password) update.password = await argon2.hash(password);

    await User.updateOne({ _id: id }, { $set: update });
    res.json({ message: 'Profile updated' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};




export { registerUser, loginUser, getUser, uploadImage, updateProfile }

