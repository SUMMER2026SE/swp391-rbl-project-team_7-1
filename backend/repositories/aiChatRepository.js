import { sql, poolPromise } from '../config/db.js';

export const getUserSessions = async (userId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT session_id, user_id, title, created_at, updated_at
      FROM ai_chat_sessions
      WHERE user_id = @userId
      ORDER BY updated_at DESC
    `);
  return result.recordset;
};

export const createSession = async (userId, title) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .input('title', sql.NVarChar(255), title)
    .query(`
      INSERT INTO ai_chat_sessions (user_id, title, created_at, updated_at)
      VALUES (@userId, @title, GETDATE(), GETDATE());
      SELECT SCOPE_IDENTITY() AS session_id;
    `);
  return result.recordset[0].session_id;
};

export const getSessionById = async (sessionId, userId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('sessionId', sql.Int, sessionId)
    .input('userId', sql.Int, userId)
    .query(`
      SELECT session_id, user_id, title, created_at, updated_at
      FROM ai_chat_sessions
      WHERE session_id = @sessionId AND user_id = @userId
    `);
  return result.recordset[0] || null;
};

export const updateSessionTimestamp = async (sessionId) => {
  const pool = await poolPromise;
  await pool.request()
    .input('sessionId', sql.Int, sessionId)
    .query(`
      UPDATE ai_chat_sessions SET updated_at = GETDATE() WHERE session_id = @sessionId
    `);
};

export const getSessionMessages = async (sessionId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('sessionId', sql.Int, sessionId)
    .query(`
      SELECT message_id, session_id, role, content, created_at
      FROM ai_chat_messages
      WHERE session_id = @sessionId
      ORDER BY created_at ASC
    `);
  return result.recordset;
};

export const saveMessage = async (sessionId, role, content) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('sessionId', sql.Int, sessionId)
    .input('role', sql.VarChar(50), role)
    .input('content', sql.NVarChar(sql.MAX), content)
    .query(`
      INSERT INTO ai_chat_messages (session_id, role, content, created_at)
      VALUES (@sessionId, @role, @content, GETDATE());
      SELECT SCOPE_IDENTITY() AS message_id;
    `);
  return result.recordset[0].message_id;
};

export const deleteSessionMessages = async (sessionId) => {
  const pool = await poolPromise;
  await pool.request()
    .input('sessionId', sql.Int, sessionId)
    .query(`DELETE FROM ai_chat_messages WHERE session_id = @sessionId`);
};

export const deleteSession = async (sessionId) => {
  const pool = await poolPromise;
  await pool.request()
    .input('sessionId', sql.Int, sessionId)
    .query(`DELETE FROM ai_chat_sessions WHERE session_id = @sessionId`);
};