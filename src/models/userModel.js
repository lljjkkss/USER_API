import { request } from "express";
import { poolConnect, pool, sql } from "../config/db.js";
import { createUser, updateUser } from "../controllers/userController.js";

export const UserModel = {
    // Get all users
    async getAll() {
        await poolConnect;
        const request = pool.request();
        const result = await request.execute("spGetUsers");
        return result.recordset;
    },

    // Get user by ID
    async getById(id) {
        await poolConnect;
        const request = pool.request();
        request.input("UserID", sql.Int, id);
        const result = await request.execute("spGetUserById");
        return result.recordset.length > 0 ? result.recordset[0] : null;
    },

    // Check if email exists
    async getByEmail(email) {
        await poolConnect;
        const request = pool.request();
        request.input("Email", sql.VarChar, email)
        const result = await request.execute("spGetUserByEmail");
        return result.recordset.length > 0 ? result.recordset[0] : null;
    },

    // Create new user
    async createUser(UserName, Email) {
        await poolConnect;
        const request = pool.request();
        request.input("UserName", sql.NVarChar, UserName);
        request.input("Email", sql.NVarChar, Email);
        const result = await request.execute("spAddUser");
        return result.recordset.length > 0 ? result.recordset[0] : null;
    },

    // Update user
    async updateUser(id, UserName, Email) {
        await poolConnect;
        const request = pool.request();
        request.input("UserID", sql.Int, id);
        request.input("UserName", sql.NVarChar, UserName);
        request.input("Email", sql.NVarChar, Email);
        const result = await request.execute("spUpdateUser");
        return result.recordset.length > 0 ? result.recordset[0] : null;
    },

    // Soft delete user
    async softDeleteUser(id) {
        await poolConnect;
        const request = pool.request();
        request.input("UserID", sql.Int, id);
        const result = await request.execute("spDeleteUser");
        return result.rowsAffected[0];
    },
};
