// Email service utility untuk mengirim email reset password

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Cek apakah menggunakan email service (Resend, SendGrid, dll)
    // Atau menggunakan SMTP dengan nodemailer
    
    const emailService = process.env.EMAIL_SERVICE || 'smtp';
    
    if (emailService === 'resend' && process.env.RESEND_API_KEY) {
      // Menggunakan Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'noreply@example.com',
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Resend API error:', error);
        return false;
      }

      return true;
    } else if (emailService === 'smtp' && process.env.SMTP_HOST) {
      // Menggunakan SMTP dengan nodemailer (perlu install nodemailer)
      // Untuk sekarang, kita akan menggunakan fetch ke API route yang akan handle SMTP
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      return response.ok;
    } else {
      // Fallback: Log ke console untuk development
      console.log('=== EMAIL (Development Mode) ===');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('HTML:', options.html);
      console.log('===============================');
      
      // Untuk development, kita anggap berhasil
      // Di production, pastikan EMAIL_SERVICE dan credentials sudah di-set
      return true;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateResetPasswordEmail(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FF4D6D 0%, #FF6B8A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Reset Password</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Halo,</p>
        <p style="font-size: 16px;">Anda telah meminta untuk mereset password akun admin Anda. Klik tombol di bawah ini untuk melanjutkan:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: linear-gradient(135deg, #FF4D6D 0%, #FF6B8A 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">Atau copy dan paste link berikut ke browser Anda:</p>
        <p style="font-size: 12px; color: #999; word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
          ${resetLink}
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          Link ini akan berlaku selama <strong>1 jam</strong>. Jika Anda tidak meminta reset password, abaikan email ini.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          Email ini dikirim secara otomatis. Mohon jangan membalas email ini.
        </p>
      </div>
    </body>
    </html>
  `;
}
