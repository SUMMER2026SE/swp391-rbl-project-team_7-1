import * as aiChatRepository from '../repositories/aiChatRepository.js';
import { sql, poolPromise } from '../config/db.js';

const FJMS_KNOWLEDGE_BASE = {
  FREELANCER: `As a Freelancer on FJMS:
    • Submit proposals on open projects that match your skills.
    • Once hired, a contract is created. Deliver work on time.
    • Escrow protects payments: employer deposits funds, released when work is approved.
    • Submit work through the contract's submission system.
    • If disputes arise, you can open a dispute from the contract page.`,
  EMPLOYER: `As an Employer on FJMS:
    • Post projects with clear requirements and budget.
    • Review freelancer proposals and hire the best fit.
    • Fund escrow to start the contract — your funds are safe until work is approved.
    • Review submitted work, approve or request revisions.
    • If issues occur, open a dispute from the contract page.`,
  ADMIN: `As an Admin on FJMS:
    • Moderate projects and proposals.
    • Manage user reports and disputes.
    • Resolve disputes with decisions: REFUND_EMPLOYER, PAY_FREELANCER, SPLIT_PAYMENT.
    • Handle violation reports and apply warnings, suspensions, or bans.`
};

const FAQ_RESPONSES = {
  'escrow': 'Escrow is a secure payment method on FJMS. The employer deposits funds into an escrow account when a contract starts. Funds are released to the freelancer only after the employer approves the submitted work. This protects both parties.',
  'contract': 'A contract on FJMS is created when an employer hires a freelancer. It includes project scope, budget, and timeline. Contracts have statuses: PENDING_APPROVAL, ACTIVE (when escrow is funded), and COMPLETED (when work is approved).',
  'proposal': 'Proposals are how freelancers apply to projects. Submit a proposal with your proposed price, delivery time, and a cover letter. Employers can ACCEPT, REJECT, or SHORTLIST proposals.',
  'dispute': 'Disputes on FJMS are used when a conflict arises between employer and freelancer. An admin reviews the case and can decide to refund the employer, pay the freelancer, or split the payment.',
  'payment': 'Payments on FJMS are handled through escrow. Employers fund the escrow account, and funds are released upon work approval. Supported payment methods include VNPay and bank transfers.',
  'account': 'To manage your account on FJMS, go to your profile settings. You can update your name, email, password, and profile information. Admins can also manage user statuses.'
};

const getFAQResponse = (message) => {
  const lower = message.toLowerCase();
  for (const [keyword, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(keyword)) {
      return response;
    }
  }
  return null;
};

const generateTitle = async (message) => {
  const maxLength = 50;
  const cleaned = message.replace(/[^\w\sÀ-ÿ]/g, '').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, cleaned.lastIndexOf(' ', maxLength)) + '...';
};

const isUnrelated = (message) => {
  const lower = message.toLowerCase();
  const fmsKeywords = [
    'proposal', 'project', 'freelancer', 'employer', 'contract', 'escrow', 'payment',
    'dispute', 'report', 'violation', 'wallet', 'withdraw', 'deposit', 'profile',
    'account', 'login', 'register', 'password', 'email', 'verify', 'skill',
    'category', 'budget', 'deadline', 'submission', 'review', 'revision', 'approve',
    'reject', 'fjm', 'fjms', 'platform', 'help', 'how', 'what', 'guide', 'support',
    'fee', 'charge', 'rating', 'review', 'notification', 'message', 'chat'
  ];
  return !fmsKeywords.some(kw => lower.includes(kw));
};

const buildPrompt = (message, role) => {
  const guidance = FJMS_KNOWLEDGE_BASE[role] || FJMS_KNOWLEDGE_BASE.FREELANCER;

  const faqResponse = getFAQResponse(message);
  if (faqResponse) {
    return faqResponse;
  }

  if (isUnrelated(message)) {
    return 'I can only assist with FJMS platform related questions.';
  }

  return `${guidance}\n\nRegarding your question: ${message}\n\nFor more details, please refer to the FJMS documentation or contact our support team.`;
};

export const getSessions = async (userId) => {
  return aiChatRepository.getUserSessions(userId);
};

export const createNewSession = async (userId) => {
  const title = 'New Chat';
  const sessionId = await aiChatRepository.createSession(userId, title);
  return { session_id: sessionId, title, user_id: userId };
};

export const getMessages = async (sessionId, userId) => {
  const session = await aiChatRepository.getSessionById(sessionId, userId);
  if (!session) {
    throw new Error('SESSION_NOT_FOUND');
  }
  return aiChatRepository.getSessionMessages(sessionId);
};

export const processChatMessage = async (sessionId, message, userId, userRole) => {
  // Validate session ownership
  const session = await aiChatRepository.getSessionById(sessionId, userId);
  if (!session) {
    throw new Error('SESSION_NOT_FOUND');
  }

  // Save user message
  await aiChatRepository.saveMessage(sessionId, 'user', message);

  // Generate AI response
  const reply = buildPrompt(message, userRole);

  // Save AI response
  await aiChatRepository.saveMessage(sessionId, 'assistant', reply);

  // Generate title from first message if it's still default
  if (session.title === 'New Chat') {
    const title = await generateTitle(message);
    const pool = await poolPromise;
    await pool.request()
      .input('sessionId', sql.Int, sessionId)
      .input('title', sql.NVarChar(255), title)
      .query(`UPDATE ai_chat_sessions SET title = @title WHERE session_id = @sessionId`);
  }

  // Update session timestamp
  await aiChatRepository.updateSessionTimestamp(sessionId);

  return { reply };
};

export const deleteExistingSession = async (sessionId, userId) => {
  const session = await aiChatRepository.getSessionById(sessionId, userId);
  if (!session) {
    throw new Error('SESSION_NOT_FOUND');
  }
  await aiChatRepository.deleteSessionMessages(sessionId);
  await aiChatRepository.deleteSession(sessionId);
  return { success: true };
};