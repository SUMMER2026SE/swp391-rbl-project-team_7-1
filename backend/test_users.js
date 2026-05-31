import dotenv from 'dotenv';
dotenv.config();
import { poolPromise } from './config/db.js';

async function check() {
  const pool = await poolPromise;
  const res = await pool.request().query('SELECT email, password_hash FROM Users WHERE role_default = \'ADMIN\'');
  console.log(res.recordset);
  process.exit(0);
}
check();
