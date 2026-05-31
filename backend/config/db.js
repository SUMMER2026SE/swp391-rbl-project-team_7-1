import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true // Trust self-signed certificates for local development
  }
};

console.log('Attempting to connect to SQL Server with config:', {
  user: config.user,
  server: config.server,
  database: config.database,
  port: config.port
});

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server successfully!');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
    process.exit(1);
  });

export { sql, poolPromise };
