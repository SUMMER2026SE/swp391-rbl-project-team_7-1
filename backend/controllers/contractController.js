import { sql, poolPromise } from '../config/db.js';

export const getContractById = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user.id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('contractId', sql.Int, contractId)
      .query(`
        SELECT c.*, p.title as project_title, p.description as project_description,
               u_emp.full_name as employer_name, u_free.full_name as freelancer_name
        FROM contracts c
        JOIN projects p ON c.project_id = p.project_id
        JOIN users u_emp ON c.employer_id = u_emp.user_id
        JOIN users u_free ON c.freelancer_id = u_free.user_id
        WHERE c.contract_id = @contractId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });
    }

    const contract = result.recordset[0];
    if (contract.employer_id !== userId && contract.freelancer_id !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem hợp đồng này.' });
    }

    res.json({ success: true, contract });
  } catch (error) {
    console.error('Error in getContractById:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết hợp đồng.' });
  }
};

export const getActiveContracts = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT c.*, p.title as project_title
        FROM contracts c
        JOIN projects p ON c.project_id = p.project_id
        WHERE (c.employer_id = @userId OR c.freelancer_id = @userId)
        ORDER BY c.created_at DESC
      `);

    res.json({ success: true, contracts: result.recordset });
  } catch (error) {
    console.error('Error in getActiveContracts:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách hợp đồng.' });
  }
};

export const submitWork = async (req, res) => {
  try {
    const { contractId } = req.params;
    const freelancerId = req.user.id;
    const { notes, externalLink } = req.body;

    const pool = await poolPromise;

    // Verify contract and ownership
    const contractCheck = await pool.request()
      .input('contractId', sql.Int, contractId)
      .query('SELECT freelancer_id, status FROM contracts WHERE contract_id = @contractId');

    if (contractCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });
    }

    const contract = contractCheck.recordset[0];
    if (contract.freelancer_id !== freelancerId) {
      return res.status(403).json({ message: 'Bạn không phải freelancer của hợp đồng này.' });
    }

    let fileUrl = null;
    if (req.files && req.files.length > 0) {
      const urls = req.files.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
      fileUrl = urls.join(',');
    }

    let description = notes || '';
    if (externalLink) {
      description += `\n\n[Đường dẫn sản phẩm]: ${externalLink}`;
    }

    await pool.request()
      .input('contractId', sql.Int, contractId)
      .input('description', sql.NVarChar, description)
      .input('fileUrl', sql.NVarChar, fileUrl)
      .query(`
        INSERT INTO work_submissions (contract_id, description, file_url, status, submitted_at)
        VALUES (@contractId, @description, @fileUrl, 'SUBMITTED', SYSUTCDATETIME())
      `);

    res.status(201).json({ success: true, message: 'Nộp sản phẩm hoàn thành thành công!' });
  } catch (error) {
    console.error('Error in submitWork:', error);
    res.status(500).json({ message: 'Lỗi server khi nộp sản phẩm.' });
  }
};

export const getContractSubmissions = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user.id;
    const pool = await poolPromise;

    // Check permissions
    const contractCheck = await pool.request()
      .input('contractId', sql.Int, contractId)
      .query('SELECT employer_id, freelancer_id FROM contracts WHERE contract_id = @contractId');

    if (contractCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });
    }

    const contract = contractCheck.recordset[0];
    if (contract.employer_id !== userId && contract.freelancer_id !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem thông tin này.' });
    }

    const result = await pool.request()
      .input('contractId', sql.Int, contractId)
      .query(`
        SELECT ws.*, r.revision_note, r.created_at as revision_requested_at, r.status as revision_status
        FROM work_submissions ws
        LEFT JOIN revisions r ON ws.submission_id = r.submission_id
        WHERE ws.contract_id = @contractId
        ORDER BY ws.submitted_at DESC
      `);

    res.json({ success: true, submissions: result.recordset });
  } catch (error) {
    console.error('Error in getContractSubmissions:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy lịch sử nộp sản phẩm.' });
  }
};

export const approveSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const employerId = req.user.id;

    const pool = await poolPromise;

    // 1. Get submission and contract details
    const subCheck = await pool.request()
      .input('submissionId', sql.Int, submissionId)
      .query(`
        SELECT ws.*, c.employer_id, c.freelancer_id, c.project_id, c.total_amount, c.contract_title
        FROM work_submissions ws
        JOIN contracts c ON ws.contract_id = c.contract_id
        WHERE ws.submission_id = @submissionId
      `);

    if (subCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp.' });
    }

    const sub = subCheck.recordset[0];
    if (sub.employer_id !== employerId) {
      return res.status(403).json({ message: 'Bạn không có quyền duyệt bài nộp này.' });
    }

    if (sub.status === 'APPROVED') {
      return res.status(400).json({ message: 'Bài nộp này đã được duyệt trước đó.' });
    }

    // 2. Perform Transaction: Approve Submission, Complete Contract/Project, Release Escrow to Freelancer
    const tx = new sql.Transaction(pool);
    await tx.begin();

    try {
      const request = tx.request();

      // Update submission status
      await request
        .input('submissionId', sql.Int, submissionId)
        .query("UPDATE work_submissions SET status = 'APPROVED', updated_at = SYSUTCDATETIME() WHERE submission_id = @submissionId");

      // Update contract status
      await request
        .input('contractId', sql.Int, sub.contract_id)
        .query("UPDATE contracts SET status = 'COMPLETED', completed_at = SYSUTCDATETIME(), updated_at = SYSUTCDATETIME() WHERE contract_id = @contractId");

      // Update project status to COMPLETED
      await request
        .input('projectId', sql.Int, sub.project_id)
        .query("UPDATE projects SET status = 'COMPLETED', updated_at = SYSUTCDATETIME() WHERE project_id = @projectId");

      // Find EscrowAccount
      const escrowResult = await request
        .input('projectId', sql.Int, sub.project_id)
        .query("SELECT TOP 1 escrow_id, amount FROM EscrowAccounts WHERE project_id = @projectId AND status = 'FUNDED'");

      if (escrowResult.recordset.length > 0) {
        const escrow = escrowResult.recordset[0];

        // Update EscrowAccount
        await request
          .input('escrowId', sql.Int, escrow.escrow_id)
          .query("UPDATE EscrowAccounts SET status = 'RELEASED' WHERE escrow_id = @escrowId");

        // Insert EscrowTransaction
        await request
          .input('escrowId', sql.Int, escrow.escrow_id)
          .input('amount', sql.Decimal(18, 2), escrow.amount)
          .query("INSERT INTO EscrowTransactions (escrow_id, amount, type, status) VALUES (@escrowId, @amount, 'RELEASE', 'COMPLETED')");

        // Find Freelancer Wallet
        let walletRes = await request
          .input('freelancerId', sql.Int, sub.freelancer_id)
          .query("SELECT wallet_id FROM Wallet WHERE user_id = @freelancerId");

        let walletId;
        if (walletRes.recordset.length === 0) {
          // Create Wallet if not exists
          const newWalletRes = await request
            .input('freelancerId', sql.Int, sub.freelancer_id)
            .query("INSERT INTO Wallet (user_id, balance, created_at, updated_at) VALUES (@freelancerId, 0, GETDATE(), GETDATE()); SELECT SCOPE_IDENTITY() as wallet_id;");
          walletId = newWalletRes.recordset[0].wallet_id;
        } else {
          walletId = walletRes.recordset[0].wallet_id;
        }

        // Add funds to Freelancer Wallet
        await request
          .input('walletId', sql.Int, walletId)
          .input('amount', sql.Decimal(18, 2), escrow.amount)
          .query("UPDATE Wallet SET balance = balance + @amount, updated_at = GETDATE() WHERE wallet_id = @walletId");

        // Insert WalletTransaction
        await request
          .input('walletId', sql.Int, walletId)
          .input('amount', sql.Decimal(18, 2), escrow.amount)
          .input('desc', sql.NVarChar(255), `Nhận thanh toán nghiệm thu hợp đồng: ${sub.contract_title}`)
          .input('escrowId', sql.Int, escrow.escrow_id)
          .query("INSERT INTO WalletTransaction (wallet_id, transaction_type, amount, description, related_escrow_id, status) VALUES (@walletId, 'ESCROW_RELEASE', @amount, @desc, @escrowId, 'COMPLETED')");
      }

      await tx.commit();
      res.json({ success: true, message: 'Duyệt bài nộp và giải ngân ký quỹ thành công!' });
    } catch (txError) {
      await tx.rollback();
      throw txError;
    }
  } catch (error) {
    console.error('Error in approveSubmission:', error);
    res.status(500).json({ message: 'Lỗi server khi duyệt sản phẩm.' });
  }
};

export const requestRevision = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const employerId = req.user.id;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ message: 'Vui lòng cung cấp nội dung yêu cầu chỉnh sửa.' });
    }

    const pool = await poolPromise;

    // Verify submission and contract ownership
    const subCheck = await pool.request()
      .input('submissionId', sql.Int, submissionId)
      .query(`
        SELECT ws.*, c.employer_id
        FROM work_submissions ws
        JOIN contracts c ON ws.contract_id = c.contract_id
        WHERE ws.submission_id = @submissionId
      `);

    if (subCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài nộp.' });
    }

    const sub = subCheck.recordset[0];
    if (sub.employer_id !== employerId) {
      return res.status(403).json({ message: 'Bạn không có quyền yêu cầu chỉnh sửa bài nộp này.' });
    }

    const tx = new sql.Transaction(pool);
    await tx.begin();

    try {
      const request = tx.request();

      // Update submission status to REVISION_REQUESTED
      await request
        .input('submissionId', sql.Int, submissionId)
        .query("UPDATE work_submissions SET status = 'REVISION_REQUESTED', updated_at = SYSUTCDATETIME() WHERE submission_id = @submissionId");

      // Insert revision request record
      await request
        .input('submissionId', sql.Int, submissionId)
        .input('employerId', sql.Int, employerId)
        .input('note', sql.NVarChar, note)
        .query(`
          INSERT INTO revisions (submission_id, requested_by, revision_note, status, created_at)
          VALUES (@submissionId, @employerId, @note, 'ACTIVE', SYSUTCDATETIME())
        `);

      await tx.commit();
      res.json({ success: true, message: 'Gửi yêu cầu chỉnh sửa thành công!' });
    } catch (txError) {
      await tx.rollback();
      throw txError;
    }
  } catch (error) {
    console.error('Error in requestRevision:', error);
    res.status(500).json({ message: 'Lỗi server khi yêu cầu chỉnh sửa.' });
  }
};
