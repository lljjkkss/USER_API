import { UserModel } from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.getById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const createUser = async (req, res) => {
  try {
    const { UserName, Email } = req.body;

    const exists = await UserModel.getByEmail(Email);
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const newUser = await UserModel.createUser(UserName, Email);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserName, Email } = req.body;

    const currentUser = await UserModel.getById(id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    if (Email && Email !== currentUser.Email) {
      const emailExists = await UserModel.getByEmail(Email);
      if (emailExists && emailExists.UserID !== parseInt(id)) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updatedUser = await UserModel.updateUser(id, UserName, Email);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const affected = await UserModel.softDeleteUser(req.params.id);
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
    const exists = await UserModel.getByEmail(email);
    res.json({
      available: !exists,
      message: exists ? "Email already exists" : "Email is available",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
