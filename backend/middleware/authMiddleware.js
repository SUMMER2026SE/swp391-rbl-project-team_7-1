import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có quyền truy cập. Vui lòng đăng nhập.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { ...decoded, id: decoded.userId }; // Contains { id, email, role, roles } based on authController
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Không có quyền truy cập. Vui lòng đăng nhập.' });
  }

  const role = req.user.role || req.user.roleDefault;
  const roles = req.user.roles || [];

  if (role !== 'ADMIN' && !roles.includes('ADMIN')) {
    return res.status(403).json({ message: 'Chỉ Admin mới được phép thực hiện tác vụ này.' });
  }

  next();
};
