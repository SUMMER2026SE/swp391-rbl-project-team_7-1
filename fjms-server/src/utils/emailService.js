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
    subject: `[FJMS] Xác thực tài khoản của bạn - Mã OTP: ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded-lg; background-color: #fcfcfc;">
        <h2 style="color: #005c55; text-align: center; border-bottom: 2px solid #005c55; padding-bottom: 10px;">XÁC THỰC EMAIL TÀI KHOẢN FJMS</h2>
        
        <p>Xin chào <strong>${fullName}</strong>,</p>
        
        <p>Cảm ơn bạn đã đăng ký tham gia nền tảng <strong>Freelancer Job Matching System (FJMS)</strong>. Để kích hoạt tài khoản của bạn, vui lòng nhập mã OTP xác thực dưới đây vào trang đăng ký:</p>
        
        <div style="background-color: #e6f5f4; border: 1px dashed #005c55; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #005c55;">${otpCode}</span>
        </div>
        
        <p style="color: #666; font-size: 14px;">⚠️ <strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn trong vòng <strong>10 phút</strong> kể từ khi email này được gửi. Hãy bảo mật mã này và không chia sẻ cho bất kỳ ai.</p>
        
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #999; text-align: center;">
          Đây là email tự động từ hệ thống FJMS. Vui lòng không trả lời email này.<br/>
          &copy; 2026 FJMS Team. All rights reserved.
        </p>
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
