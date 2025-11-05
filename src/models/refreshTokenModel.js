import { poolConnect, pool, sql } from "../config/db.js";

export const refreshTokenModel = {
  async saveRefreshToken(token, userId, expiryDate) {
    await poolConnect;
    const dbRequest = pool.request();
    dbRequest.input("RefreshToken", sql.NVarChar(500), token);
    dbRequest.input("UserId", sql.Int, userId);
    dbRequest.input("ExpiryDate", sql.DateTime, expiryDate);
    await dbRequest.execute("spSaveRefreshToken");
  },

  async getRefreshToken(token) {
    await poolConnect;
    const dbRequest = pool.request();
    dbRequest.input("RefreshToken", sql.NVarChar(500), token);
    const result = await dbRequest.execute("spGetRefreshToken");
    return result.recordset.length > 0 ? result.recordset[0] : null;
  },

  async deleteRefreshToken(token) {
    await poolConnect;
    const dbRequest = pool.request();
    dbRequest.input("RefreshToken", sql.NVarChar(500), token);
    await dbRequest.execute("spDeleteRefreshToken");
  },
};
