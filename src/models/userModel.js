import { poolConnect, pool, sql } from "../config/db.js";

export const userModel = {
  // Get all users
  async getAll() {
    await poolConnect;
    const dbRequest = pool.request();
    const result = await dbRequest.execute("spGetUsers");
    return result.recordset;
  },

  // Get user by ID
  async getById(id) {
    await poolConnect;
    const dbRequest = pool.request();
    dbRequest.input("UserId", sql.Int, id);
    const result = await dbRequest.execute("spGetUserById");
    return result.recordset.length > 0 ? result.recordset[0] : null;
  },

  // Check if email exists
  async getByEmail(email) {
    await poolConnect;
    const dbRequest = pool.request();
    dbRequest.input("Email", sql.VarChar, email);
    const result = await dbRequest.execute("spGetUserByEmail");
    return result.recordset.length > 0 ? result.recordset[0] : null;
  },

  // Create new user
  async createUser(userName, email, passwordHash) {
    await poolConnect;
    const dbRequest = pool.request();
    dbRequest.input("UserName", sql.NVarChar, userName);
    dbRequest.input("Email", sql.NVarChar, email);
    dbRequest.input("PasswordHash", sql.NVarChar, passwordHash);
    const result = await dbRequest.execute("spAddUser");
    return result.recordset.length > 0 ? result.recordset[0] : null;
  },

  // Update user
  async updateUser(id, userName, email, passwordHash) {
    await poolConnect;
    const dbRequest = pool.request();
    dbRequest.input("UserId", sql.Int, id);
    dbRequest.input("UserName", sql.NVarChar, userName);
    dbRequest.input("Email", sql.NVarChar, email);
    dbRequest.input("PasswordHash", sql.NVarChar, passwordHash);
    const result = await dbRequest.execute("spUpdateUser");
    return result.recordset.length > 0 ? result.recordset[0] : null;
  },

  // Soft delete user
  async softDeleteUser(id) {
    await poolConnect;
    const dbRequest = pool.request();
    dbRequest.input("UserId", sql.Int, id);
    const result = await dbRequest.execute("spDeleteUser");
    return result.rowsAffected[0];
  },
};
