import { poolPromise } from '../config/db.js';

export const initDb = async () => {
  try {
    const pool = await poolPromise;
    
    // Create Wallet Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Wallet' and xtype='U')
      CREATE TABLE Wallet (
        wallet_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        balance DECIMAL(18,2) DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      );
    `);

    // Create BankAccount Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BankAccount' and xtype='U')
      CREATE TABLE BankAccount (
        bank_account_id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL,
        bank_name NVARCHAR(100) NOT NULL,
        account_number NVARCHAR(50) NOT NULL,
        account_holder_name NVARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME DEFAULT GETDATE()
      );
    `);

    // Create WalletTransaction Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='WalletTransaction' and xtype='U')
      CREATE TABLE WalletTransaction (
        transaction_id INT IDENTITY(1,1) PRIMARY KEY,
        wallet_id INT NOT NULL,
        transaction_type NVARCHAR(50) NOT NULL, -- e.g., 'DEPOSIT'
        amount DECIMAL(18,2) NOT NULL,
        description NVARCHAR(255),
        created_at DATETIME DEFAULT GETDATE()
      );
    `);

    // Create reviews Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reviews' and xtype='U')
      CREATE TABLE reviews (
        review_id INT IDENTITY(1,1) PRIMARY KEY,
        contract_id INT NOT NULL,
        reviewer_id INT NOT NULL,
        reviewee_id INT NOT NULL,
        rating INT NOT NULL,
        comment NVARCHAR(1000),
        created_at DATETIME DEFAULT GETDATE()
      );
    `);

    console.log('✅ Wallet Management and Review tables initialized (if not existed)');
  } catch (error) {
    console.error('❌ Failed to initialize database tables:', error);
  }
};
