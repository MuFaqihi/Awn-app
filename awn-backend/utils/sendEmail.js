// utils/sendEmail.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send OTP email to patient
 */
async function sendOtpEmail(to, otp) {
  try {
    await resend.emails.send({
      from: 'Awn <no-reply@awn.sa>', // configure this domain correctly in Resend
      to,
      subject: 'رمز التحقق لحسابك في عون',
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="text-align: center; color: #111827;">رمز التحقق الخاص بك</h2>
          <p style="text-align: center; color: #4B5563;">استخدم هذا الرمز لإكمال عملية تسجيل الدخول أو إنشاء الحساب:</p>
          <p style="text-align: center; font-size: 28px; font-weight: 700; letter-spacing: 8px; margin: 16px 0; color: #111827;">
            ${otp}
          </p>
          <p style="text-align: center; color: #6B7280; font-size: 14px;">
            هذا الرمز صالح لمدة <strong>10 دقائق</strong>.
          </p>
          <p style="text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 24px;">
            إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذه الرسالة.
          </p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('❌ Resend email error:', error);
    return false;
  }
}

module.exports = { sendOtpEmail };
