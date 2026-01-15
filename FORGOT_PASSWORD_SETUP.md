# Setup Fitur Lupa Password

Fitur lupa password telah ditambahkan ke aplikasi. Dokumen ini menjelaskan cara setup dan konfigurasi.

## Fitur yang Tersedia

1. **Halaman Lupa Password** (`/cekhasil/login/forgot-password`)
   - User dapat memasukkan email untuk meminta reset password
   - Link reset password akan dikirim ke email

2. **Halaman Reset Password** (`/cekhasil/login/reset-password?token=...`)
   - User dapat mengatur password baru menggunakan token dari email
   - Token berlaku selama 1 jam

3. **API Endpoints**
   - `POST /api/auth/forgot-password` - Request reset password
   - `GET /api/auth/verify-reset-token` - Verifikasi token reset
   - `POST /api/auth/reset-password` - Reset password dengan token

## Setup Email Service

Untuk mengirim email reset password, Anda perlu mengkonfigurasi email service. Ada beberapa opsi:

### Opsi 1: Resend (Recommended untuk Production)

1. Daftar di [Resend](https://resend.com)
2. Dapatkan API key
3. Tambahkan ke `.env.local`:

```env
EMAIL_SERVICE=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

### Opsi 2: SMTP (Gmail, Outlook, dll)

1. Install nodemailer:
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

2. Buat API route untuk email di `src/app/api/email/send/route.ts` (opsional, bisa menggunakan langsung di `lib/email.ts`)

3. Tambahkan ke `.env.local`:

```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

**Catatan untuk Gmail:**
- Gunakan App Password, bukan password biasa
- Aktifkan 2-Step Verification terlebih dahulu
- Generate App Password di: https://myaccount.google.com/apppasswords

### Opsi 3: Development Mode (Default)

Jika tidak ada konfigurasi email, sistem akan:
- Log email ke console (untuk development)
- Tetap membuat token reset password
- Link reset password akan muncul di console log

## Environment Variables

Tambahkan ke `.env.local`:

```env
# Email Configuration
EMAIL_SERVICE=smtp  # atau 'resend'
ADMIN_EMAIL=admin@example.com  # Email admin yang akan menerima reset password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123  # Password default (akan diupdate setelah reset)

# Base URL untuk reset link
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Ganti dengan domain production
```

## Database Tables

Sistem akan otomatis membuat tabel berikut:

1. **password_reset_tokens**
   - Menyimpan token reset password
   - Token berlaku 1 jam
   - Token akan ditandai sebagai used setelah digunakan

2. **admin_credentials**
   - Menyimpan password admin yang sudah direset
   - Password disimpan sebagai plain text (untuk production, gunakan hash!)

## Security Notes

⚠️ **PENTING untuk Production:**

1. **Password Hashing**: Saat ini password disimpan sebagai plain text di database. Untuk production:
   - Install bcrypt: `npm install bcrypt`
   - Hash password sebelum menyimpan
   - Bandingkan hash saat login

2. **Email Verification**: Pastikan email admin sudah diverifikasi sebelum digunakan

3. **Rate Limiting**: Pertimbangkan menambahkan rate limiting untuk mencegah abuse

4. **HTTPS**: Pastikan menggunakan HTTPS di production untuk keamanan token

## Cara Menggunakan

1. User mengklik "Lupa Password?" di halaman login
2. User memasukkan email admin
3. Sistem mengirim email dengan link reset password
4. User mengklik link di email
5. User memasukkan password baru
6. Password berhasil direset dan user bisa login dengan password baru

## Troubleshooting

### Email tidak terkirim
- Cek konfigurasi email service di `.env.local`
- Cek console log untuk melihat error
- Pastikan credentials email benar

### Token tidak valid
- Token hanya berlaku 1 jam
- Token hanya bisa digunakan sekali
- Pastikan URL lengkap dengan token

### Password tidak berubah setelah reset
- Cek apakah password tersimpan di database `admin_credentials`
- Pastikan login route membaca dari database
- Restart server setelah perubahan

## Testing

Untuk testing tanpa email service:
1. Gunakan development mode (default)
2. Cek console log untuk melihat link reset password
3. Copy link dan buka di browser
4. Reset password
