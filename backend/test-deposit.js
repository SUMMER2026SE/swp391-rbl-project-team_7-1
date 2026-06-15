import { sql, poolPromise } from './config/db.js';

async function test() {
  try {
    const pool = await poolPromise;
    const walletId = 1;
    const amount = 50000;

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const request = transaction.request();
      
      // Update balance
      await request
        .input('wallet_id', sql.Int, walletId)
        .input('amount', sql.Decimal(18, 2), amount)
        .query('UPDATE Wallet SET balance = balance + @amount, updated_at = GETDATE() WHERE wallet_id = @wallet_id');

      // Insert transaction
      await request
        .input('transaction_type', sql.NVarChar(50), 'DEPOSIT')
        .input('description', sql.NVarChar(255), 'Nạp tiền vào ví')
        .query('INSERT INTO WalletTransaction (wallet_id, transaction_type, amount, description) VALUES (@wallet_id, @transaction_type, @amount, @description)');

      await transaction.commit();
      console.log('Success!');
    } catch (txError) {
      await transaction.rollback();
      throw txError;
    }
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    process.exit(0);
  }
}

test();
