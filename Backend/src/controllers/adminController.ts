import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import argon2 from "argon2";



const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin) {
      res.status(400).json({ message: "Admin does not exist" });
    } else {
      const isMatch = await argon2.verify(admin.password, password);

      if (!isMatch) {
        res.status(400).json({ message: "Password did not match" });
      }

      const token = jwt.sign(
        { adminId: admin._id, email: admin.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Admin login successful',
        token,
        admin
      });
    }
  } catch (error) {
    console.log("Error occurred in admin login", error);
    res.status(500).json({ message: 'Server error' });
  }
};



const fetchAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userDatas = await User.find({ isUser: true });
    res.json({ users: userDatas });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};



const createUser = async (req: Request, res: Response): Promise<void> => {
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



const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { _id, username, email } = req.body;

    if (!_id) {
      res.status(400).json({ message: "User ID required" });
      return;
    }

    await User.findByIdAndUpdate(
      _id,
      { username, email },
      { runValidators: true }
    );

    res.json({ message: "User Updated Successfully!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update failed" });
  }
};



const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.id;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const deleteTheUser = await User.findByIdAndDelete( userId )

      if (!deleteTheUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User Deleted Successfully!" });



  } catch (error) {
    console.log(error);
  }
};



const getUserById = async (req: Request, res: Response) : Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error });
  }
};



export {loginAdmin, fetchAllUsers, createUser, updateUser, deleteUser, getUserById}