import { poolPromise } from '../config/db.js';

export const getBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('user_id', userId)
      .query('SELECT * FROM BankAccount WHERE user_id = @user_id');

    if (result.recordset.length === 0) {
      return res.status(200).json(null);
    }
    
    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('getBankAccount error:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin tài khoản ngân hàng.' });
  }
};

export const createBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bank_name, account_number, account_holder_name } = req.body;

    if (!bank_name || !account_number || !account_holder_name) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin ngân hàng.' });
    }

    const pool = await poolPromise;
    
    // Check if a bank account already exists
    const checkResult = await pool.request()
      .input('user_id', userId)
      .query('SELECT bank_account_id FROM BankAccount WHERE user_id = @user_id');

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ message: 'Người dùng đã có tài khoản ngân hàng. Vui lòng cập nhật thay vì tạo mới.' });
    }

    const result = await pool.request()
      .input('user_id', userId)
      .input('bank_name', bank_name)
      .input('account_number', account_number)
      .input('account_holder_name', account_holder_name)
      .query(`
        INSERT INTO BankAccount (user_id, bank_name, account_number, account_holder_name) 
        OUTPUT INSERTED.*
        VALUES (@user_id, @bank_name, @account_number, @account_holder_name)
      `);

    return res.status(201).json({
      message: 'Thêm tài khoản ngân hàng thành công.',
      bankAccount: result.recordset[0]
    });
  } catch (error) {
    console.error('createBankAccount error:', error);
    res.status(500).json({ message: 'Lỗi server khi thêm tài khoản ngân hàng.' });
  }
};

export const updateBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { bank_name, account_number, account_holder_name } = req.body;

    if (!bank_name || !account_number || !account_holder_name) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin ngân hàng.' });
    }

    const pool = await poolPromise;
    
    // Check if the bank account exists and belongs to the user
    const checkResult = await pool.request()
      .input('bank_account_id', id)
      .input('user_id', userId)
      .query('SELECT * FROM BankAccount WHERE bank_account_id = @bank_account_id AND user_id = @user_id');

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản ngân hàng.' });
    }

    const result = await pool.request()
      .input('bank_account_id', id)
      .input('user_id', userId)
      .input('bank_name', bank_name)
      .input('account_number', account_number)
      .input('account_holder_name', account_holder_name)
      .query(`
        UPDATE BankAccount 
        SET bank_name = @bank_name, 
            account_number = @account_number, 
            account_holder_name = @account_holder_name,
            updated_at = GETDATE()
        OUTPUT INSERTED.*
        WHERE bank_account_id = @bank_account_id AND user_id = @user_id
      `);

    return res.status(200).json({
      message: 'Cập nhật tài khoản ngân hàng thành công.',
      bankAccount: result.recordset[0]
    });
  } catch (error) {
    console.error('updateBankAccount error:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật tài khoản ngân hàng.' });
  }
};
