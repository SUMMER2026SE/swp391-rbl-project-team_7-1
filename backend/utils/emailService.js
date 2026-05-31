import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address (e.g. your_email@gmail.com)
    pass: process.env.EMAIL_PASS  // Your Gmail App Password (not your main password)
  }
});

/**
 * Send OTP Verification Email
 * @param {string} toEmail - Recipient email address
 * @param {string} otpCode - The 6-digit verification code
 * @param {string} fullName - Recipient full name
 */
export const sendOTPEmail = async (toEmail, otpCode, fullName) => {
  // If email config is not present, fall back to console logging
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n======================================================`);
    console.log(`📩 [SIMULATED EMAIL] To: ${toEmail}`);
    console.log(`👋 Hi ${fullName},`);
    console.log(`🔑 Your FJMS Verification OTP Code is: ${otpCode}`);
    console.log(`⏰ This code will expire in 10 minutes.`);
    console.log(`======================================================\n`);
    return { simulated: true };
  }

  const mailOptions = {
    from: `"FJMS - Job Matching System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `[FJMS] Your Verification Code: ${otpCode}`,
    html: `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #F8FAFC;">
        <div style="background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #E2E8F0;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1E293B; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">FJMS Security</h1>
            <p style="color: #64748B; margin-top: 8px; font-size: 15px;">Authentication Request</p>
          </div>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hello <strong>${fullName}</strong>,
          </p>
          
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We received a request to authenticate your account. Please use the following verification code to complete the process:
          </p>
          
          <div style="background: linear-gradient(135deg, #0F766E 0%, #115E59 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 30px 0; box-shadow: 0 10px 15px -3px rgba(15, 118, 110, 0.2);">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #ffffff;">${otpCode}</span>
          </div>
          
          <p style="color: #64748B; font-size: 14px; line-height: 1.5; margin-bottom: 30px; padding: 12px; background-color: #F1F5F9; border-radius: 8px; border-left: 4px solid #0F766E;">
            <strong style="color: #1E293B;">Note:</strong> This code is valid for exactly <strong>10 minutes</strong>. For your security, do not share this code with anyone, including FJMS staff.
          </p>
          
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            If you did not request this code, please ignore this email or contact support if you have concerns.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #E2E8F0; margin: 40px 0 20px;" />
          
          <p style="font-size: 13px; color: #94A3B8; text-align: center; line-height: 1.5;">
            This is an automated message from FJMS. Please do not reply.<br/>
            &copy; ${new Date().getFullYear()} FJMS Team. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Real Email successfully sent to ${toEmail}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send real email to ${toEmail}:`, error);
    // Return fallback so the app continues
    return { success: false, error: error.message };
  }
};
