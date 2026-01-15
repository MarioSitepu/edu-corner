# Konfigurasi Email yang Benar

## ⚠️ PENTING: EMAIL_FROM vs ADMIN_EMAIL

Ada 2 environment variables yang berbeda untuk email:

### 1. ADMIN_EMAIL (Email Tujuan)
- **Nilai:** `educorner.my.id@gmail.com` ✅ BENAR
- **Fungsi:** Email admin yang akan MENERIMA OTP reset password
- **Bisa menggunakan:** Email apapun (Gmail, Yahoo, dll)

### 2. EMAIL_FROM (Email Pengirim)
- **Nilai:** TIDAK BOLEH menggunakan Gmail! ❌
- **Fungsi:** Email yang digunakan untuk MENGIRIM OTP
- **Harus menggunakan:** Domain yang sudah di-verify di Resend

## Konfigurasi yang Benar

### Untuk Development/Testing:
```env
# Email admin yang akan MENERIMA OTP
ADMIN_EMAIL=educorner.my.id@gmail.com

# Email pengirim (harus domain Resend untuk testing)
EMAIL_FROM=onboarding@resend.dev

# Resend API Key
RESEND_API_KEY=re_your_api_key_here
```

### Untuk Production:
```env
# Email admin yang akan MENERIMA OTP
ADMIN_EMAIL=educorner.my.id@gmail.com

# Email pengirim (harus domain yang sudah verified di Resend)
EMAIL_FROM=noreply@educorner.my.id

# Resend API Key
RESEND_API_KEY=re_your_api_key_here
```

## Mengapa EMAIL_FROM Tidak Bisa Gmail?

1. **Resend tidak mengizinkan** email personal sebagai "from" address
2. **Email service provider** (seperti Resend) hanya bisa mengirim dengan domain mereka sendiri atau domain yang sudah di-verify
3. **Untuk keamanan** dan mencegah spam, email "from" harus dari domain yang terpercaya

## Setup Domain di Resend (Untuk Production)

Jika ingin menggunakan `noreply@educorner.my.id`:

1. Login ke [Resend Dashboard](https://resend.com)
2. Buka menu "Domains"
3. Klik "Add Domain"
4. Masukkan: `educorner.my.id`
5. Ikuti instruksi untuk setup DNS records:
   - SPF record
   - DKIM record
   - DMARC record (opsional)
6. Tunggu hingga domain verified (biasanya beberapa menit)
7. Setelah verified, gunakan: `EMAIL_FROM=noreply@educorner.my.id`

## Quick Fix untuk Testing

Jika ingin cepat testing tanpa setup domain:

```env
ADMIN_EMAIL=educorner.my.id@gmail.com
EMAIL_FROM=onboarding@resend.dev  # ← Ini yang penting!
RESEND_API_KEY=re_your_api_key_here
```

Dengan konfigurasi ini:
- ✅ OTP akan dikirim dari `onboarding@resend.dev`
- ✅ OTP akan diterima di `educorner.my.id@gmail.com`
- ✅ Tidak perlu verifikasi domain untuk testing

## Checklist

- [ ] `ADMIN_EMAIL` = `educorner.my.id@gmail.com` (email yang menerima)
- [ ] `EMAIL_FROM` = `onboarding@resend.dev` (untuk testing) atau `noreply@educorner.my.id` (untuk production setelah domain verified)
- [ ] `RESEND_API_KEY` sudah di-set
- [ ] Tidak menggunakan Gmail di `EMAIL_FROM`
- [ ] Redeploy aplikasi setelah mengubah environment variables

## Troubleshooting

**Error: "EMAIL_FROM tidak boleh menggunakan email personal"**
- Solusi: Ubah `EMAIL_FROM` ke `onboarding@resend.dev` untuk testing

**Email tidak terkirim**
- Cek apakah `RESEND_API_KEY` sudah benar
- Cek apakah `EMAIL_FROM` menggunakan domain Resend atau domain verified
- Cek Vercel logs untuk error detail
