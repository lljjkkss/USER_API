import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const createUser = async (req, res) => {
  try {
    const { userName, email } = req.body;

    const existingUser = await userModel.getByEmail(email);
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const newUser = await userModel.createUser(userName, email);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, email, password } = req.body;

    const currentUser = await userModel.getById(id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    if (email && email !== currentUser.email) {
      const otherUser = await userModel.getByEmail(email);
      if (otherUser && otherUser.userId !== parseInt(id)) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await userModel.updateUser(id, userName, email, hashedPassword);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const affected = await userModel.softDeleteUser(req.params.id);
    if (affected === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const exists = await userModel.getByEmail(email);
    res.json({
      available: !exists,
      message: exists ? "Email already exists" : "Email is available",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
