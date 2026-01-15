// Email service utility untuk mengirim email reset password dengan OTP

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Menggunakan Resend sebagai email service utama
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || process.env.RESEND_FROM_EMAIL;
    
    console.log('=== Email Service Debug ===');
    console.log('RESEND_API_KEY exists:', !!resendApiKey);
    console.log('RESEND_API_KEY length:', resendApiKey?.length || 0);
    console.log('EMAIL_FROM:', emailFrom);
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    
    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY tidak ditemukan di environment variables!');
      console.error('Silakan tambahkan RESEND_API_KEY ke .env.local atau environment variables di Vercel');
      console.log('=== EMAIL (Development Mode - Resend API Key Missing) ===');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('===============================');
      return false;
    }

    if (!emailFrom) {
      console.error('❌ EMAIL_FROM tidak ditemukan di environment variables!');
      console.error('Silakan tambahkan EMAIL_FROM ke .env.local atau environment variables di Vercel');
      console.error('Contoh: EMAIL_FROM=onboarding@resend.dev');
      return false;
    }

    // Validasi EMAIL_FROM tidak boleh menggunakan Gmail atau email personal
    if (emailFrom.includes('@gmail.com') || emailFrom.includes('@yahoo.com') || emailFrom.includes('@hotmail.com')) {
      console.error('❌ EMAIL_FROM tidak boleh menggunakan email personal (Gmail, Yahoo, Hotmail, dll)!');
      console.error('EMAIL_FROM harus menggunakan domain yang sudah di-verify di Resend');
      console.error('Untuk testing: gunakan EMAIL_FROM=onboarding@resend.dev');
      console.error('Untuk production: gunakan EMAIL_FROM=noreply@educorner.my.id (setelah domain verified)');
      console.error('Email yang Anda set:', emailFrom);
      return false;
    }

    // Menggunakan Resend API
    console.log('Mengirim email via Resend API...');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    const responseText = await response.text();
    console.log('Resend API Response Status:', response.status);
    console.log('Resend API Response:', responseText);

    if (!response.ok) {
      let error;
      try {
        error = JSON.parse(responseText);
      } catch {
        error = { message: responseText };
      }
      console.error('❌ Resend API error:', error);
      console.error('Status:', response.status);
      console.error('Response:', error);
      return false;
    }

    const result = JSON.parse(responseText);
    console.log('✅ Email berhasil dikirim via Resend:', result);
    console.log('Email ID:', result.id);
    return true;
  } catch (error: any) {
    console.error('❌ Error sending email via Resend:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return false;
  }
}

export function generateOTPEmail(otp: string): string {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Kode OTP Reset Password - EduCorner</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header dengan gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #FF4D6D 0%, #FF6B8A 50%, #FF8FA3 100%); padding: 40px 30px; text-align: center;">
                  <div style="margin-bottom: 10px;">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 12px;">
                      <path d="M30 15C35.5228 15 40 19.4772 40 25C40 30.5228 35.5228 35 30 35C24.4772 35 20 30.5228 20 25C20 19.4772 24.4772 15 30 15Z" fill="white" stroke="white" stroke-width="2"/>
                      <path d="M50 55C50 45.0589 40.9411 37.5 30 37.5C19.0589 37.5 10 45.0589 10 55" stroke="white" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    Kode OTP Reset Password
                  </h1>
                  <p style="color: rgba(255, 255, 255, 0.95); margin: 10px 0 0 0; font-size: 16px; font-weight: 400;">
                    EduCorner: SahabatMimpi
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; font-weight: 500;">
                    Halo Admin, 👋
                  </p>
                  
                  <p style="font-size: 15px; color: #666666; margin: 0 0 30px 0; line-height: 1.8;">
                    Anda telah meminta untuk mereset password akun admin Anda. Gunakan kode OTP berikut untuk melanjutkan proses reset password:
                  </p>

                  <!-- OTP Box dengan desain menarik -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <div style="background: linear-gradient(135deg, #FFF5F5 0%, #FFE4E9 100%); border: 3px solid #FF4D6D; border-radius: 16px; padding: 30px; display: inline-block; box-shadow: 0 8px 16px rgba(255, 77, 109, 0.15);">
                          <p style="margin: 0 0 10px 0; font-size: 13px; color: #FF4D6D; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            Kode OTP Anda
                          </p>
                          <div style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #FF4D6D; font-family: 'Courier New', 'Monaco', monospace; text-align: center; line-height: 1.2; text-shadow: 0 2px 4px rgba(255, 77, 109, 0.2);">
                            ${otp}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Info Box -->
                  <div style="background-color: #F0F9FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 30px 0; border-radius: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #1E40AF; line-height: 1.6;">
                      <strong>⏰ Waktu Berlaku:</strong> Kode OTP ini akan berlaku selama <strong>10 menit</strong> sejak email ini dikirim.
                    </p>
                  </div>

                  <!-- Security Warning -->
                  <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 20px 0; border-radius: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #92400E; line-height: 1.6;">
                      <strong>🔒 Keamanan:</strong> Jangan bagikan kode OTP ini kepada siapapun, termasuk tim support. Tim EduCorner tidak akan pernah meminta kode OTP Anda.
                    </p>
                  </div>

                  <!-- Warning jika tidak meminta -->
                  <p style="font-size: 14px; color: #666666; margin: 25px 0 0 0; line-height: 1.7;">
                    Jika Anda tidak meminta reset password, abaikan email ini atau hubungi administrator jika Anda merasa ada aktivitas mencurigakan pada akun Anda.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                  <p style="margin: 0 0 10px 0; font-size: 12px; color: #9CA3AF; line-height: 1.6;">
                    Email ini dikirim secara otomatis oleh sistem EduCorner: SahabatMimpi.<br>
                    Mohon jangan membalas email ini.
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 11px; color: #D1D5DB;">
                    © ${new Date().getFullYear()} EduCorner: SahabatMimpi. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
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
