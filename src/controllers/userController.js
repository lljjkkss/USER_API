import { poolConnect, pool, sql } from "../config/db.js";

// Lấy tất cả user
export const getUsers = async (req, res) => {
  try {
    await poolConnect;
    const request = pool.request();
    const result = await request.execute("spGetUsers");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Lấy user theo ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    await poolConnect;
    const request = pool.request();
    request.input("UserID", sql.Int, id);
    const result = await request.execute("spGetUserById");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Thêm user mới
export const createUser = async (req, res) => {
  try {
    const { UserName, Email } = req.body;
    await poolConnect;
    const request = pool.request();
    request.input("UserName", sql.NVarChar, UserName);
    request.input("Email", sql.NVarChar, Email);

    const result = await request.execute("spAddUser");
    res.status(201).json({ NewUserID: result.recordset[0].NewUserID });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Cập nhật user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserName, Email } = req.body;
    await poolConnect;
    const request = pool.request();
    request.input("UserID", sql.Int, id);
    request.input("UserName", sql.NVarChar, UserName);
    request.input("Email", sql.NVarChar, Email);

    const result = await request.execute("spUpdateUser");
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Xóa mềm user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await poolConnect;
    const request = pool.request();
    request.input("UserID", sql.Int, id);
    await request.execute("spDeleteUser");

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
