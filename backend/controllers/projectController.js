import { sql, poolPromise } from '../config/db.js';

/**
 * Get all projects (OPEN status only for public search - with Filters)
 */
export const getProjects = async (req, res) => {
  try {
    const { q, categoryId, budgetMin, budgetMax, budgetType } = req.query;
    const pool = await poolPromise;

    let query = `
      SELECT p.*, pc.category_name, u.full_name as company_name, u.avatar_url
      FROM projects p
      LEFT JOIN project_categories pc ON p.category_id = pc.category_id
      LEFT JOIN users u ON p.employer_id = u.user_id
      WHERE p.status = 'OPEN'
    `;

    const request = pool.request();

    if (q) {
      request.input('search', sql.NVarChar, `%${q}%`);
      query += ` AND (p.title LIKE @search OR p.description LIKE @search)`;
    }

    if (categoryId) {
      request.input('categoryId', sql.Int, parseInt(categoryId));
      query += ` AND p.category_id = @categoryId`;
    }

    if (budgetMin) {
      request.input('budgetMin', sql.Decimal(18, 2), parseFloat(budgetMin));
      query += ` AND (p.budget_max >= @budgetMin OR p.budget_min >= @budgetMin)`;
    }

    if (budgetMax) {
      request.input('budgetMax', sql.Decimal(18, 2), parseFloat(budgetMax));
      query += ` AND (p.budget_min <= @budgetMax OR p.budget_max <= @budgetMax)`;
    }

    if (budgetType) {
      request.input('budgetType', sql.VarChar, budgetType.toUpperCase());
      query += ` AND p.budget_type = @budgetType`;
    }

    query += ` ORDER BY p.created_at DESC`;

    const result = await request.query(query); // Sửa lỗi gọi biến query của bạn ở đây từ `query.query` thành `request.query(query)`

    // Fetch skills for each project
    const projects = result.recordset;
    for (let project of projects) {
      const skillsResult = await pool.request()
        .input('projectId', sql.Int, project.project_id)
        .query(`
          SELECT s.skill_name 
          FROM project_skills ps
          JOIN skills s ON ps.skill_id = s.skill_id
          WHERE ps.project_id = @projectId
        `);
      project.skills = skillsResult.recordset.map(r => r.skill_name);
    }

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách dự án.' });
  }
};

/**
 * Get single project details by ID
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('projectId', sql.Int, id)
      .query(`
        SELECT p.*, pc.category_name, u.full_name as company_name, u.avatar_url, u.address as location, u.email as contact_email
        FROM projects p
        LEFT JOIN project_categories pc ON p.category_id = pc.category_id
        LEFT JOIN users u ON p.employer_id = u.user_id
        WHERE p.project_id = @projectId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dự án.' });
    }

    const project = result.recordset[0];

    // Fetch skills
    const skillsResult = await pool.request()
      .input('projectId', sql.Int, id)
      .query(`
        SELECT s.skill_name 
        FROM project_skills ps
        JOIN skills s ON ps.skill_id = s.skill_id
        WHERE ps.project_id = @projectId
      `);
    project.skills = skillsResult.recordset.map(r => r.skill_name);

    res.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching project by id:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết dự án.' });
  }
};

/**
 * Get projects belonging to the logged-in Employer
 */
export const getEmployerProjects = async (req, res) => {
  try {
    const employerId = req.user.id;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('employerId', sql.Int, employerId)
      .query(`
        SELECT p.*, pc.category_name
        FROM projects p
        LEFT JOIN project_categories pc ON p.category_id = pc.category_id
        WHERE p.employer_id = @employerId
        ORDER BY p.created_at DESC
      `);

    const projects = result.recordset;

    for (let project of projects) {
      // Fetch skills
      const skillsResult = await pool.request()
        .input('projectId', sql.Int, project.project_id)
        .query(`
          SELECT s.skill_name 
          FROM project_skills ps
          JOIN skills s ON ps.skill_id = s.skill_id
          WHERE ps.project_id = @projectId
        `);
      project.skills = skillsResult.recordset.map(r => r.skill_name);

      // Count proposals
      const proposalsResult = await pool.request()
        .input('projectId', sql.Int, project.project_id)
        .query(`SELECT COUNT(*) as count FROM proposals WHERE project_id = @projectId`);
      project.proposalsCount = proposalsResult.recordset[0].count;
    }

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Error fetching employer projects:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách dự án của bạn.' });
  }
};

/**
 * Submit a proposal for a project (From develop)
 */
export const submitProposal = async (req, res) => {
  try {
    const { projectId } = req.params;
    const freelancerId = req.user.id; 
    let { proposedPrice, deliveryTimeDays, coverLetter } = req.body;

    if (!proposedPrice || !deliveryTimeDays) {
      return res.status(400).json({ message: 'Vui lòng cung cấp giá thầu và thời gian ước tính.' });
    }

    if (parseFloat(proposedPrice) <= 0) {
      return res.status(400).json({ message: 'Giá thầu phải lớn hơn 0 VNĐ.' });
    }

    const pool = await poolPromise;

    const projectCheck = await pool.request()
      .input('projectId', sql.Int, projectId)
      .query('SELECT 1 FROM projects WHERE project_id = @projectId');
    
    if (projectCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dự án để ứng tuyển.' });
    }

    const proposalCheck = await pool.request()
      .input('projectId', sql.Int, projectId)
      .input('freelancerId', sql.Int, freelancerId)
      .query('SELECT 1 FROM proposals WHERE project_id = @projectId AND freelancer_id = @freelancerId');

    if (proposalCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'Bạn đã nộp đề xuất cho dự án này rồi.' });
    }

    if (req.file) {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      coverLetter = `${coverLetter || ''}\n\n----------------------------------------\n[Tệp đính kèm]: ${fileUrl}`;
    }

    await pool.request()
      .input('projectId', sql.Int, projectId)
      .input('freelancerId', sql.Int, freelancerId)
      .input('proposedPrice', sql.Decimal(12, 2), parseFloat(proposedPrice))
      .input('deliveryTimeDays', sql.Int, parseInt(deliveryTimeDays))
      .input('coverLetter', sql.NVarChar, coverLetter || '')
      .input('status', sql.VarChar, 'PENDING')
      .query(`
        INSERT INTO proposals (project_id, freelancer_id, proposed_price, delivery_time_days, cover_letter, status, created_at)
        VALUES (@projectId, @freelancerId, @proposedPrice, @deliveryTimeDays, @coverLetter, @status, SYSUTCDATETIME())
      `);

    res.status(201).json({ success: true, message: 'Nộp đề xuất ứng tuyển thành công!' });
  } catch (error) {
    console.error('Error submitting proposal:', error);
    res.status(500).json({ message: 'Lỗi server khi nộp đề xuất.' });
  }
};

/**
 * Get all project categories (From develop)
 */
export const getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT category_id, category_name FROM project_categories');
    res.json({ success: true, categories: result.recordset });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách danh mục.' });
  }
};

/**
 * Create a new Project
 */
export const createProject = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { title, description, category_id, budget_type, budget_min, budget_max, required_freelancer_count, deadline, skills } = req.body;

    if (!title || !description || !budget_type) {
      return res.status(400).json({ message: 'Vui lòng cung cấp tiêu đề, mô tả và loại ngân sách.' });
    }

    let categoryId = parseInt(category_id);
    if (isNaN(categoryId)) {
      const catMap = {
        'web': 1, 'Programming': 1,
        'design': 2, 'Design': 2,
        'writing': 3, 'Writing': 3,
        'translation': 4, 'Translation': 4,
        'accounting': 1, 'marketing': 5, 'Marketing': 5
      };
      categoryId = catMap[category_id] || 1; 
    }

    const pool = await poolPromise;

    const bType = budget_type.toUpperCase() === 'HOURLY' ? 'HOURLY' : 'FIXED';
    const numFreelancers = required_freelancer_count ? parseInt(required_freelancer_count) : 1;
    const deadlineDate = deadline ? new Date(deadline) : null;

    const result = await pool.request()
      .input('employerId', sql.Int, employerId)
      .input('categoryId', sql.Int, categoryId)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('budgetType', sql.VarChar, bType)
      .input('budgetMin', sql.Decimal(18, 2), budget_min ? parseFloat(budget_min) : null)
      .input('budgetMax', sql.Decimal(18, 2), budget_max ? parseFloat(budget_max) : null)
      .input('requiredFreelancerCount', sql.Int, numFreelancers)
      .input('deadline', sql.Date, deadlineDate)
      .query(`
        INSERT INTO projects (employer_id, category_id, title, description, budget_type, budget_min, budget_max, required_freelancer_count, deadline, status, created_at)
        VALUES (@employerId, @categoryId, @title, @description, @budgetType, @budgetMin, @budgetMax, @requiredFreelancerCount, @deadline, 'OPEN', SYSUTCDATETIME());
        SELECT SCOPE_IDENTITY() AS project_id;
      `);

    const projectId = result.recordset[0].project_id;

    if (Array.isArray(skills) && skills.length > 0) {
      for (let skillName of skills) {
        if (!skillName.trim()) continue;

        let skillResult = await pool.request()
          .input('skillName', sql.NVarChar, skillName.trim())
          .query(`SELECT skill_id FROM skills WHERE skill_name = @skillName`);

        let skillId;
        if (skillResult.recordset.length === 0) {
          const insertSkill = await pool.request()
            .input('skillName', sql.NVarChar, skillName.trim())
            .query(`
              INSERT INTO skills (skill_name, created_at)
              VALUES (@skillName, SYSUTCDATETIME());
              SELECT SCOPE_IDENTITY() AS skill_id;
            `);
          skillId = insertSkill.recordset[0].skill_id;
        } else {
          skillId = skillResult.recordset[0].skill_id;
        }

        await pool.request()
          .input('projectId', sql.Int, projectId)
          .input('skillId', sql.Int, skillId)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM project_skills WHERE project_id = @projectId AND skill_id = @skillId)
            BEGIN
              INSERT INTO project_skills (project_id, skill_id, created_at)
              VALUES (@projectId, @skillId, SYSUTCDATETIME());
            END
          `);
      }
    }

    res.status(201).json({ success: true, message: 'Đăng dự án thành công!', projectId });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng dự án mới.' });
  }
};

/**
 * Update project details
 */
export const updateProject = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { id } = req.params;
    const { title, description, category_id, budget_type, budget_min, budget_max, required_freelancer_count, deadline, skills } = req.body;

    if (!title || !description || !budget_type) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc.' });
    }

    const pool = await poolPromise;

    const ownerCheck = await pool.request()
      .input('projectId', sql.Int, id)
      .query(`SELECT employer_id FROM projects WHERE project_id = @projectId`);

    if (ownerCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dự án.' });
    }

    if (ownerCheck.recordset[0].employer_id !== employerId) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa dự án này.' });
    }

    let categoryId = parseInt(category_id);
    if (isNaN(categoryId)) {
      const catMap = {
        'web': 1, 'Programming': 1,
        'design': 2, 'Design': 2,
        'writing': 3, 'Writing': 3,
        'translation': 4, 'Translation': 4,
        'accounting': 1, 'marketing': 5, 'Marketing': 5
      };
      categoryId = catMap[category_id] || 1;
    }

    const bType = budget_type.toUpperCase() === 'HOURLY' ? 'HOURLY' : 'FIXED';
    const numFreelancers = required_freelancer_count ? parseInt(required_freelancer_count) : 1;
    const deadlineDate = deadline ? new Date(deadline) : null;

    await pool.request()
      .input('projectId', sql.Int, id)
      .input('categoryId', sql.Int, categoryId)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('budgetType', sql.VarChar, bType)
      .input('budgetMin', sql.Decimal(18, 2), budget_min ? parseFloat(budget_min) : null)
      .input('budgetMax', sql.Decimal(18, 2), budget_max ? parseFloat(budget_max) : null)
      .input('requiredFreelancerCount', sql.Int, numFreelancers)
      .input('deadline', sql.Date, deadlineDate)
      .query(`
        UPDATE projects
        SET category_id = @categoryId,
            title = @title,
            description = @description,
            budget_type = @budgetType,
            budget_min = @budgetMin,
            budget_max = @budgetMax,
            required_freelancer_count = @requiredFreelancerCount,
            deadline = @deadline,
            updated_at = SYSUTCDATETIME()
        WHERE project_id = @projectId
      `);

    await pool.request()
      .input('projectId', sql.Int, id)
      .query(`DELETE FROM project_skills WHERE project_id = @projectId`);

    if (Array.isArray(skills) && skills.length > 0) {
      for (let skillName of skills) {
        if (!skillName.trim()) continue;

        let skillResult = await pool.request()
          .input('skillName', sql.NVarChar, skillName.trim())
          .query(`SELECT skill_id FROM skills WHERE skill_name = @skillName`);

        let skillId;
        if (skillResult.recordset.length === 0) {
          const insertSkill = await pool.request()
            .input('skillName', sql.NVarChar, skillName.trim())
            .query(`
              INSERT INTO skills (skill_name, created_at)
              VALUES (@skillName, SYSUTCDATETIME());
              SELECT SCOPE_IDENTITY() AS skill_id;
            `);
          skillId = insertSkill.recordset[0].skill_id;
        } else {
          skillId = skillResult.recordset[0].skill_id;
        }

        await pool.request()
          .input('projectId', sql.Int, id)
          .input('skillId', sql.Int, skillId)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM project_skills WHERE project_id = @projectId AND skill_id = @skillId)
            BEGIN
              INSERT INTO project_skills (project_id, skill_id, created_at)
              VALUES (@projectId, @skillId, SYSUTCDATETIME());
            END
          `);
      }
    }

    res.json({ success: true, message: 'Cập nhật dự án thành công!' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi cập nhật dự án.' });
  }
};

/**
 * Close project (Status = CLOSED)
 */
export const closeProject = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { id } = req.params;
    const pool = await poolPromise;

    const ownerCheck = await pool.request()
      .input('projectId', sql.Int, id)
      .query(`SELECT employer_id FROM projects WHERE project_id = @projectId`);

    if (ownerCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dự án.' });
    }

    if (ownerCheck.recordset[0].employer_id !== employerId) {
      return res.status(403).json({ message: 'Bạn không có quyền đóng dự án này.' });
    }

    await pool.request()
      .input('projectId', sql.Int, id)
      .query(`
        UPDATE projects
        SET status = 'CLOSED',
            updated_at = SYSUTCDATETIME()
        WHERE project_id = @projectId
      `);

    res.json({ success: true, message: 'Dự án đã được đóng thành công!' });
  } catch (error) {
    console.error('Error closing project:', error);
    res.status(500).json({ message: 'Lỗi hệ thống khi đóng dự án.' });
  }
};