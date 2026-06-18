import { sql, poolPromise } from '../../config/db.js';

export const depositEscrow = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { projectId, amount } = req.body;

    if (!projectId || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Thông tin ký quỹ không hợp lệ' });
    }

    const pool = await poolPromise;

    // 1. Check Employer Wallet Balance
    let walletResult = await pool.request()
      .input('user_id', sql.Int, employerId)
      .query('SELECT wallet_id, balance FROM Wallet WHERE user_id = @user_id');

    if (walletResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Không tìm thấy ví của bạn' });
    }

    const wallet = walletResult.recordset[0];
    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Số dư ví không đủ để ký quỹ' });
    }

    // 2. Perform transaction: Deduct Wallet, Add Escrow, Insert Transactions
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const request = transaction.request();

      // Deduct from Wallet
      await request
        .input('wallet_id', sql.Int, wallet.wallet_id)
        .input('amount', sql.Decimal(18, 2), amount)
        .query('UPDATE Wallet SET balance = balance - @amount, updated_at = GETDATE() WHERE wallet_id = @wallet_id');

      // Insert WalletTransaction
      await request
        .input('transaction_type', sql.NVarChar(50), 'ESCROW_DEPOSIT')
        .input('description', sql.NVarChar(255), `Ký quỹ dự án #${projectId}`)
        .query("INSERT INTO WalletTransaction (wallet_id, transaction_type, amount, description, status) VALUES (@wallet_id, @transaction_type, -@amount, @description, 'COMPLETED')");

      // Insert EscrowAccounts
      await request
        .input('project_id', sql.Int, projectId)
        .input('employer_id', sql.Int, employerId)
        .query('INSERT INTO EscrowAccounts (project_id, employer_id, amount) VALUES (@project_id, @employer_id, @amount)');
      
      const escrowResult = await request.query('SELECT @@IDENTITY AS escrow_id');
      const escrowId = escrowResult.recordset[0].escrow_id;

      // Insert EscrowTransactions
      await request
        .input('escrow_id', sql.Int, escrowId)
        .input('type', sql.NVarChar(50), 'DEPOSIT')
        .query('INSERT INTO EscrowTransactions (escrow_id, amount, type) VALUES (@escrow_id, @amount, @type)');

      // Find the ACCEPTED proposal for this project to get the freelancer_id and proposal info
      const proposalRes = await request
        .query("SELECT TOP 1 proposal_id, freelancer_id, proposed_price FROM proposals WHERE project_id = @project_id AND status = 'ACCEPTED' ORDER BY created_at DESC");
      
      if (proposalRes.recordset.length > 0) {
        const prop = proposalRes.recordset[0];
        
        // Find project title
        const projectRes = await request
          .query("SELECT title FROM projects WHERE project_id = @project_id");
        const projectTitle = projectRes.recordset[0]?.title || 'Dự án';

        // Insert Contract
        await request
          .input('freelancer_id_val', sql.Int, prop.freelancer_id)
          .input('proposal_id_val', sql.Int, prop.proposal_id)
          .input('contract_title_val', sql.NVarChar, `Hợp đồng: ${projectTitle}`)
          .input('total_amount_val', sql.Decimal(18, 2), prop.proposed_price)
          .query(`
            INSERT INTO contracts (project_id, employer_id, freelancer_id, proposal_id, contract_title, total_amount, status, started_at, created_at, updated_at)
            VALUES (@project_id, @employer_id, @freelancer_id_val, @proposal_id_val, @contract_title_val, @total_amount_val, 'ACTIVE', SYSUTCDATETIME(), SYSUTCDATETIME(), SYSUTCDATETIME())
          `);
          
        // Update project status to ACTIVE
        await request.query("UPDATE projects SET status = 'ACTIVE' WHERE project_id = @project_id");
      }

      await transaction.commit();

      res.status(200).json({ message: 'Ký quỹ thành công', escrowId });
    } catch (txError) {
      await transaction.rollback();
      throw txError;
    }
  } catch (error) {
    console.error('depositEscrow error:', error);
    res.status(500).json({ message: 'Lỗi server khi ký quỹ.' });
  }
};

export const getEscrowByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('project_id', sql.Int, projectId)
      .query('SELECT * FROM EscrowAccounts WHERE project_id = @project_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin ký quỹ cho dự án này' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('getEscrowByProject error:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin ký quỹ.' });
  }
};
