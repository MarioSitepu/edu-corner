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

## Setup Email Service dengan Resend

Aplikasi menggunakan **Resend** sebagai email service untuk mengirim email reset password.

### Langkah-langkah Setup Resend

1. **Daftar di Resend**
   - Kunjungi [https://resend.com](https://resend.com)
   - Buat akun gratis (free tier: 3,000 emails/bulan)
   - Verifikasi email Anda

2. **Buat API Key**
   - Login ke dashboard Resend
   - Buka menu "API Keys"
   - Klik "Create API Key"
   - Beri nama (contoh: "EduCorner Production")
   - Copy API key (format: `re_xxxxxxxxxxxxx`)

3. **Setup Domain (Opsional untuk Production)**
   - Untuk production, sebaiknya verifikasi domain Anda
   - Buka menu "Domains" di Resend
   - Add domain: `educorner.my.id`
   - Ikuti instruksi untuk setup DNS records
   - Setelah verified, Anda bisa menggunakan email seperti `noreply@educorner.my.id`

4. **Tambahkan ke Environment Variables**
   
   Tambahkan ke `.env.local`:
   
   ```env
   # Resend Configuration (Required)
   RESEND_API_KEY=re_your_api_key_here
   
   # Email From Address
   # Untuk development/testing, gunakan domain Resend: onboarding@resend.dev
   # Untuk production, gunakan domain verified Anda: noreply@educorner.my.id
   EMAIL_FROM=onboarding@resend.dev
   # atau untuk production:
   # EMAIL_FROM=noreply@educorner.my.id
   ```

### Testing Email

1. **Development Mode:**
   - Gunakan `onboarding@resend.dev` sebagai EMAIL_FROM
   - Email akan dikirim ke alamat yang Anda masukkan
   - Cocok untuk testing

2. **Production Mode:**
   - Verifikasi domain `educorner.my.id` di Resend
   - Gunakan `noreply@educorner.my.id` sebagai EMAIL_FROM
   - Email akan dikirim dengan domain Anda sendiri

### Troubleshooting

**Email tidak terkirim:**
- Pastikan `RESEND_API_KEY` sudah benar
- Pastikan `EMAIL_FROM` sudah di-set
- Cek console log untuk error message
- Pastikan API key masih aktif di dashboard Resend

**Email masuk ke spam:**
- Verifikasi domain di Resend
- Setup SPF, DKIM, dan DMARC records
- Gunakan domain verified sebagai EMAIL_FROM

## Environment Variables

Tambahkan ke `.env.local`:

```env
# Resend Email Configuration (Required)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev  # Untuk development
# EMAIL_FROM=noreply@educorner.my.id  # Untuk production (setelah domain verified)

# Admin Configuration
ADMIN_EMAIL=educorner.my.id@gmail.com  # Email admin yang akan menerima reset password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123  # Password default (akan diupdate setelah reset)

# Base URL untuk reset link
NEXT_PUBLIC_BASE_URL=https://educorner.my.id
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
