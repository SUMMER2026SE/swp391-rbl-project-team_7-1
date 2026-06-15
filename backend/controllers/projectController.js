import { sql, poolPromise } from '../config/db.js';

/**
 * Get all active/open projects
 */
export const getProjects = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT p.*, u.full_name as employer_name, c.category_name 
        FROM projects p
        LEFT JOIN users u ON p.employer_id = u.user_id
        LEFT JOIN project_categories c ON p.category_id = c.category_id
        ORDER BY p.created_at DESC
      `);
    res.json({ success: true, projects: result.recordset });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách dự án.' });
  }
};

/**
 * Get project by ID
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('projectId', sql.Int, id)
      .query(`
        SELECT p.*, u.full_name as employer_name, c.category_name 
        FROM projects p
        LEFT JOIN users u ON p.employer_id = u.user_id
        LEFT JOIN project_categories c ON p.category_id = c.category_id
        WHERE p.project_id = @projectId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dự án.' });
    }

    res.json({ success: true, project: result.recordset[0] });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết dự án.' });
  }
};

/**
 * Submit a proposal for a project
 */
export const submitProposal = async (req, res) => {
  try {
    const { projectId } = req.params;
    const freelancerId = req.user.id; // From authMiddleware
    let { proposedPrice, deliveryTimeDays, coverLetter } = req.body;

    if (!proposedPrice || !deliveryTimeDays) {
      return res.status(400).json({ message: 'Vui lòng cung cấp giá thầu và thời gian ước tính.' });
    }

    if (parseFloat(proposedPrice) <= 0) {
      return res.status(400).json({ message: 'Giá thầu phải lớn hơn 0 VNĐ.' });
    }

    const pool = await poolPromise;

    // Check if project exists
    const projectCheck = await pool.request()
      .input('projectId', sql.Int, projectId)
      .query('SELECT 1 FROM projects WHERE project_id = @projectId');
    
    if (projectCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dự án để ứng tuyển.' });
    }

    // Check if freelancer already submitted a proposal
    const proposalCheck = await pool.request()
      .input('projectId', sql.Int, projectId)
      .input('freelancerId', sql.Int, freelancerId)
      .query('SELECT 1 FROM proposals WHERE project_id = @projectId AND freelancer_id = @freelancerId');

    if (proposalCheck.recordset.length > 0) {
      return res.status(400).json({ message: 'Bạn đã nộp đề xuất cho dự án này rồi.' });
    }

    // Append file URL to cover letter if a file was uploaded
    if (req.file) {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      coverLetter = `${coverLetter || ''}\n\n----------------------------------------\n[Tệp đính kèm]: ${fileUrl}`;
    }

    // Insert proposal
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
 * Get all project categories
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
 * Create a new project
 */
export const createProject = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { title, description, categoryId, customCategory, budgetType, budgetMin, budgetMax, deadline, skills } = req.body;

    if (!title || !description || !budgetType) {
      return res.status(400).json({ message: 'Vui lòng điền tiêu đề, mô tả và loại ngân sách.' });
    }

    const amount = parseFloat(budgetMin);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Ngân sách phải lớn hơn 0 VNĐ.' });
    }

    const pool = await poolPromise;

    // Handle custom category write-in
    let finalCategoryId = categoryId ? parseInt(categoryId) : null;
    if (categoryId === 'other' && customCategory && customCategory.trim()) {
      const catName = customCategory.trim();
      let catResult = await pool.request()
        .input('catName', sql.NVarChar, catName)
        .query('SELECT category_id FROM project_categories WHERE category_name = @catName');
      
      if (catResult.recordset.length === 0) {
        const insertCat = await pool.request()
          .input('catName', sql.NVarChar, catName)
          .query('INSERT INTO project_categories (category_name) VALUES (@catName); SELECT SCOPE_IDENTITY() AS category_id;');
        finalCategoryId = insertCat.recordset[0].category_id;
      } else {
        finalCategoryId = catResult.recordset[0].category_id;
      }
    }

    // Insert project
    const projectInsertResult = await pool.request()
      .input('employerId', sql.Int, employerId)
      .input('categoryId', sql.Int, finalCategoryId)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('budgetType', sql.VarChar, budgetType)
      .input('budgetMin', sql.Decimal(12, 2), amount)
      .input('budgetMax', sql.Decimal(12, 2), amount)
      .input('requiredFreelancerCount', sql.Int, 1)
      .input('deadline', sql.Date, deadline ? new Date(deadline) : null)
      .input('status', sql.VarChar, 'OPEN')
      .query(`
        INSERT INTO projects (employer_id, category_id, title, description, budget_type, budget_min, budget_max, required_freelancer_count, deadline, status, created_at)
        VALUES (@employerId, @categoryId, @title, @description, @budgetType, @budgetMin, @budgetMax, @requiredFreelancerCount, @deadline, @status, SYSUTCDATETIME());
        SELECT SCOPE_IDENTITY() AS project_id;
      `);

    const projectId = projectInsertResult.recordset[0].project_id;

    // Handle skills
    if (Array.isArray(skills)) {
      for (const skillName of skills) {
        // Find or insert skill
        let skillIdResult = await pool.request()
          .input('skillName', sql.NVarChar, skillName)
          .query('SELECT skill_id FROM skills WHERE skill_name = @skillName');
        
        let skillId;
        if (skillIdResult.recordset.length === 0) {
          const insertResult = await pool.request()
            .input('skillName', sql.NVarChar, skillName)
            .query('INSERT INTO skills (skill_name, created_at) VALUES (@skillName, SYSUTCDATETIME()); SELECT SCOPE_IDENTITY() AS skill_id;');
          skillId = insertResult.recordset[0].skill_id;
        } else {
          skillId = skillIdResult.recordset[0].skill_id;
        }

        // Connect to project
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
    res.status(500).json({ message: 'Lỗi server khi đăng dự án.' });
  }
};
