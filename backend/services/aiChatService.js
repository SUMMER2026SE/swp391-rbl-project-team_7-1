import * as aiChatRepository from '../repositories/aiChatRepository.js';
import { sql, poolPromise } from '../config/db.js';

const SYSTEM_PROMPT = `You are FJMS AI Assistant, a helpful and knowledgeable assistant for the Freelance Job Management System (FJMS) platform.

You help users with:
- Projects (posting, browsing, managing)
- Proposals (submitting, reviewing, accepting/rejecting)
- Contracts (creation, statuses: PENDING_APPROVAL, ACTIVE, COMPLETED)
- Escrow (secure payment system, funding, releasing funds)
- Wallet (balance, transactions, deposits, withdrawals)
- Payments (VNPay, bank transfers, escrow releases)
- Reviews and ratings
- Disputes (opening, resolution process)
- Freelancer workflow (proposals, work submission, getting paid)
- Employer workflow (posting projects, hiring, escrow, reviewing work)
- Platform support and guidance
- Violations and reports
- Account management and profile settings

Guidelines:
1. Answer naturally and conversationally - do NOT sound robotic or scripted
2. Explain concepts step-by-step when needed
3. Use markdown formatting for clarity (bullet points, bold, short paragraphs)
4. Be concise but thorough
5. If a question is completely unrelated to FJMS platform, respond politely: "I can help with FJMS platform related questions. Feel free to ask about projects, proposals, contracts, escrow, payments, or any other FJMS features!"

Remember previous context from the conversation history. Be consistent and reference earlier messages when relevant.`;

const ROLE_CONTEXT = {
  FREELANCER: `The user is a FREELANCER on FJMS. Prioritize guidance on:
- Browsing and applying to projects with proposals
- Managing active contracts and submitting work
- Getting paid through escrow releases
- Building reputation through reviews and ratings
- Withdrawing earnings to their wallet
- Communicating with employers`,
  EMPLOYER: `The user is an EMPLOYER on FJMS. Prioritize guidance on:
- Posting projects with clear requirements and budget
- Reviewing freelancer proposals and hiring
- Funding escrow to start contracts
- Reviewing submitted work and approving/rejecting
- Managing disputes if issues arise
- Making payments and managing their wallet`,
  ADMIN: `The user is an ADMIN on FJMS. Prioritize guidance on:
- Moderating projects and proposals
- Managing user reports and violations
- Resolving disputes with decisions (REFUND_EMPLOYER, PAY_FREELANCER, SPLIT_PAYMENT)
- Applying warnings, suspensions, or bans
- Viewing analytics and generating reports
- Managing platform settings and users`
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
    'fee', 'charge', 'rating', 'notification', 'message', 'chat', 'hi', 'hello',
    'hey', 'thanks', 'thank', 'okay', 'ok', 'yes', 'no', 'good', 'great', 'awesome',
    'can', 'could', 'would', 'should', 'do', 'does', 'is', 'are', 'was', 'were',
    'create', 'make', 'find', 'search', 'look', 'see', 'show', 'tell', 'explain',
    'start', 'begin', 'finish', 'complete', 'done', 'working', 'work', 'job',
    'hire', 'hiring', 'apply', 'applied', 'submit', 'submitted', 'status',
    'pending', 'active', 'completed', 'cancelled', 'money', 'fund', 'funding',
    'balance', 'transaction', 'transfer', 'bank', 'vnpay', 'payment method'
  ];
  // Allow conversational starters and greetings
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
  if (greetings.some(g => lower.includes(g))) return false;
  // If message is very short, allow it
  if (lower.split(' ').length <= 3) return false;
  return !fmsKeywords.some(kw => lower.includes(kw));
};

const buildConversationPrompt = (messages, userRole, currentMessage) => {
  const roleContext = ROLE_CONTEXT[userRole] || ROLE_CONTEXT.FREELANCER;
  
  let prompt = `${SYSTEM_PROMPT}\n\n${roleContext}\n\n`;
  prompt += `## Conversation History\n`;
  
  // Add previous messages for context (limit to last 10 for token efficiency)
  const recentMessages = messages.slice(-10);
  for (const msg of recentMessages) {
    const role = msg.role === 'user' ? 'User' : 'Assistant';
    prompt += `${role}: ${msg.content}\n`;
  }
  
  prompt += `\n## Current User Message\nUser: ${currentMessage}\n\nAssistant:`;
  
  return prompt;
};

const generateAIResponse = async (prompt) => {
  // Check if OpenAI/Gemini API key is configured
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  
  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: prompt.split('\n\n## Conversation History')[0] },
            { role: 'user', content: prompt.split('## Current User Message\nUser: ')[1]?.split('\n\nAssistant:')[0] || prompt }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      }
    } catch (err) {
      console.error('OpenAI API error:', err);
    }
  }
  
  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
      }
    } catch (err) {
      console.error('Gemini API error:', err);
    }
  }
  
  // Fallback: Generate contextual response using knowledge base
  return generateFallbackResponse(prompt);
};

const generateFallbackResponse = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Check if unrelated
  const userMsg = prompt.split('User: ').pop()?.split('\n\nAssistant:')[0] || '';
  if (isUnrelated(userMsg) && userMsg.split(' ').length > 3) {
    return "I can help with FJMS platform related questions. Feel free to ask about projects, proposals, contracts, escrow, payments, or any other FJMS features!";
  }
  
  // Greeting detection
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening))/.test(userMsg.toLowerCase().trim())) {
    const role = prompt.includes('FREELANCER') ? 'freelancer' : 
                 prompt.includes('EMPLOYER') ? 'employer' : 'admin';
    return `Hello! 👋 I'm your FJMS AI Assistant. I'm here to help you with anything related to the platform. As a ${role}, you can ask me about:\n\n- Managing your projects and proposals\n- Understanding contracts and escrow\n- Payment and wallet questions\n- Platform features and best practices\n\nWhat can I help you with today?`;
  }
  
  // Thank you detection
  if (/thanks|thank you|appreciate/i.test(userMsg)) {
    return "You're welcome! 😊 If you have any more questions about FJMS, feel free to ask. I'm here to help!";
  }
  
  // Context-aware responses based on keywords
  const hasEscrow = /escrow|fund|deposit|release/i.test(lowerPrompt);
  const hasContract = /contract|hire|hiring|agreement/i.test(lowerPrompt);
  const hasProposal = /proposal|apply|bid|offer/i.test(lowerPrompt);
  const hasDispute = /dispute|conflict|issue|problem/i.test(lowerPrompt);
  const hasPayment = /payment|pay|paid|withdraw|withdrawal|money|wallet|balance/i.test(lowerPrompt);
  const hasProject = /project|job|work|task|gig/i.test(lowerPrompt);
  const hasProfile = /profile|account|setting|password|email/i.test(lowerPrompt);
  const hasReview = /review|rating|rate|feedback/i.test(lowerPrompt);
  
  if (hasEscrow) {
    return `**Escrow System on FJMS** 🔒\n\nEscrow is a secure payment method that protects both employers and freelancers:\n\n1. **How it works:** When a contract starts, the employer deposits funds into an escrow account\n2. **Work submission:** The freelancer completes and submits the work\n3. **Approval:** The employer reviews and approves the work\n4. **Release:** Funds are released to the freelancer upon approval\n\n**Key benefits:**\n- Employers: Funds are safe until work is approved\n- Freelancers: Payment is guaranteed once work is accepted\n- Disputes: If issues arise, an admin can review and decide\n\nWould you like to know more about funding escrow or the dispute resolution process?`;
  }
  
  if (hasContract) {
    return `**Contracts on FJMS** 📋\n\nA contract is created when an employer hires a freelancer:\n\n**Contract Statuses:**\n- **PENDING_APPROVAL** - Waiting for both parties to confirm\n- **ACTIVE** - Escrow has been funded, work in progress\n- **COMPLETED** - Work approved, payment released\n- **CANCELLED** - Contract terminated\n\n**What's included:**\n- Project scope and deliverables\n- Budget and payment terms\n- Timeline and milestones\n\nNeed help with a specific contract status or action?`;
  }
  
  if (hasProposal) {
    return `**Proposals on FJMS** 📝\n\n**For Freelancers:**\n- Browse open projects that match your skills\n- Submit a proposal with your price, timeline, and cover letter\n- Employers can ACCEPT, REJECT, or SHORTLIST your proposal\n\n**For Employers:**\n- Review proposals from interested freelancers\n- Compare prices, timelines, and experience\n- Accept the best fit to start a contract\n\n**Tips:**\n- Be specific about your approach and experience\n- Set a competitive but fair price\n- Respond to employer questions promptly\n\nWould you like guidance on writing a strong proposal?`;
  }
  
  if (hasDispute) {
    return `**Dispute Resolution on FJMS** ⚖️\n\nIf a conflict arises between employer and freelancer:\n\n1. **Open a dispute** from the contract page\n2. **Provide evidence** - screenshots, messages, work samples\n3. **Admin review** - A platform admin reviews the case\n4. **Resolution options:**\n   - **REFUND_EMPLOYER** - Return funds to employer\n   - **PAY_FREELANCER** - Release payment to freelancer\n   - **SPLIT_PAYMENT** - Divide funds between both parties\n\n**Before opening a dispute:**\n- Try to communicate and resolve issues directly\n- Document all communication\n- Review the contract terms\n\nNeed help opening or managing a dispute?`;
  }
  
  if (hasPayment) {
    return `**Payments & Wallet on FJMS** 💰\n\n**Wallet Features:**\n- View your balance and transaction history\n- Deposit funds via VNPay or bank transfer\n- Withdraw earnings to your bank account\n\n**Payment Flow:**\n1. Employer funds escrow when hiring\n2. Freelancer submits work\n3. Employer approves → payment released\n4. Freelancer can withdraw funds\n\n**Supported Methods:**\n- VNPay (instant deposits)\n- Bank transfers\n- Escrow (secure contract payments)\n\nWould you like help with a specific payment or wallet action?`;
  }
  
  if (hasProject) {
    return `**Projects on FJMS** 🚀\n\n**For Employers:**\n- Post projects with clear requirements and budget\n- Set categories and skills needed\n- Review proposals and hire the best freelancer\n\n**For Freelancers:**\n- Browse projects by category and skills\n- Filter by budget, timeline, and experience level\n- Submit proposals to projects you're interested in\n\n**Project Tips:**\n- Be detailed in your project description\n- Set realistic budgets and timelines\n- Communicate clearly with your partner\n\nWould you like to know more about posting or finding projects?`;
  }
  
  if (hasProfile) {
    return `**Account Management on FJMS** 👤\n\nYou can manage your account from your profile settings:\n\n- **Update profile** - Name, bio, skills, portfolio\n- **Change password** - Keep your account secure\n- **Email settings** - Update notification preferences\n- **Account status** - View your verification and standing\n\n**For Freelancers:**\n- Showcase your skills and experience\n- Add portfolio items and certifications\n\n**For Employers:**\n- Company information\n- Past project history\n\nNeed help with a specific account setting?`;
  }
  
  if (hasReview) {
    return `**Reviews & Ratings on FJMS** ⭐\n\nAfter a contract is completed:\n\n- **Employers** can rate freelancers on quality, communication, and timeliness\n- **Freelancers** can rate employers on clarity, communication, and fairness\n\n**Why reviews matter:**\n- Build trust in the community\n- Help freelancers get more projects\n- Help employers find reliable talent\n- Maintain platform quality\n\nBoth parties are encouraged to leave honest, constructive feedback!`;
  }
  
  // Default contextual response
  return `I understand you're asking about FJMS platform features. Let me help you with that!\n\nHere are some topics I can assist with:\n\n- **Projects** - Posting, browsing, and managing\n- **Proposals** - Submitting and reviewing\n- **Contracts** - Statuses and management\n- **Escrow** - Secure payments\n- **Wallet** - Balance and transactions\n- **Disputes** - Resolution process\n\nCould you provide more details about what you'd like to know? I'm here to help! 😊`;
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

  // Get conversation history for context
  const previousMessages = await aiChatRepository.getSessionMessages(sessionId);
  
  // Build AI prompt with conversation memory
  const prompt = buildConversationPrompt(previousMessages, userRole, message);
  
  // Generate AI response
  const reply = await generateAIResponse(prompt);

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