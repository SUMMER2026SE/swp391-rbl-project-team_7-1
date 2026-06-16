import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import bankAccountRoutes from './routes/bankAccountRoutes.js';
import vnpayRoutes from './modules/payment/vnpay.routes.js';
import transactionRoutes from './modules/transaction/transaction.routes.js';
import escrowRoutes from './modules/escrow/escrow.routes.js';
import withdrawalRoutes from './modules/withdrawal/withdrawal.routes.js';
import { sql, poolPromise } from './config/db.js';
import { initDb } from './utils/initDb.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// CORS setup to allow client origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Main Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/wallet', walletRoutes);
app.use('/api/bank-account', bankAccountRoutes);

// Iteration 2 Routes
app.use('/api/payment/vnpay', vnpayRoutes);
app.use('/api/wallet/transactions', transactionRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/withdrawal', withdrawalRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    message: 'FJMS API server is running smoothly.'
  });
});

// Socket.io Real-time Event Handlers
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`👥 User ${socket.id} joined room: ${room}`);
  });

  socket.on('send_message', async (data) => {
    const { projectId, contractId, senderId, messageContent, messageType, room } = data;
    try {
      const pool = await poolPromise;
      await pool.request()
        .input('projectId', sql.Int, projectId)
        .input('contractId', sql.Int, contractId || null)
        .input('senderId', sql.Int, senderId)
        .input('messageContent', sql.NVarChar, messageContent)
        .input('messageType', sql.VarChar, messageType || 'TEXT')
        .input('isRead', sql.Bit, 0)
        .query(`
          INSERT INTO messages (project_id, contract_id, sender_id, message_content, message_type, is_read, sent_at)
          VALUES (@projectId, @contractId, @senderId, @messageContent, @messageType, @isRead, SYSUTCDATETIME())
        `);

      // Broadcast to room members
      io.to(room).emit('receive_message', {
        project_id: projectId,
        contract_id: contractId || null,
        sender_id: senderId,
        message_content: messageContent,
        message_type: messageType || 'TEXT',
        is_read: false,
        sent_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Socket message save error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Start listening and pre-warm db connection pool
server.listen(PORT, async () => {
  console.log(`============================================`);
  console.log(`🚀 FJMS Backend Server running on http://localhost:${PORT}`);
  console.log(`============================================`);
  
  try {
    // Warm up connection pool immediately on startup
    await poolPromise;
    // Initialize DB tables for Wallet Management
    await initDb();
  } catch (err) {
    console.error('❌ Failed to connect to SQL Server during server startup.');
  }
});
