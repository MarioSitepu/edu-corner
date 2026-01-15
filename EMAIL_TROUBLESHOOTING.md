# Troubleshooting Email OTP Tidak Terkirim

Jika email OTP tidak terkirim ke `educorner.my.id@gmail.com`, ikuti langkah-langkah berikut:

## 1. Cek Environment Variables

Pastikan environment variables sudah di-set dengan benar:

### Di Local Development (.env.local):
```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=educorner.my.id@gmail.com
```

### Di Vercel Production:
1. Buka dashboard Vercel
2. Pilih project Anda
3. Buka Settings > Environment Variables
4. Pastikan variabel berikut sudah di-set:
   - `RESEND_API_KEY` = API key dari Resend
   - `EMAIL_FROM` = `onboarding@resend.dev` (untuk development) atau `noreply@educorner.my.id` (untuk production setelah domain verified)
   - `ADMIN_EMAIL` = `educorner.my.id@gmail.com`

## 2. Cek Resend API Key

1. Login ke [Resend Dashboard](https://resend.com)
2. Buka menu "API Keys"
3. Pastikan API key masih aktif
4. Copy API key yang benar (format: `re_xxxxxxxxxxxxx`)
5. Pastikan API key sudah di-set di environment variables

## 3. Cek Email From Address

### Untuk Development/Testing:
- Gunakan: `onboarding@resend.dev`
- Ini adalah domain default Resend untuk testing
- Tidak perlu verifikasi domain

### Untuk Production:
- Verifikasi domain `educorner.my.id` di Resend terlebih dahulu
- Setelah verified, gunakan: `noreply@educorner.my.id`
- Atau email lain dengan domain yang sudah verified

## 4. Cek Console Logs

Saat request lupa password, cek console logs untuk melihat error:

### Di Local Development:
- Buka terminal tempat Next.js server berjalan
- Cari log yang dimulai dengan `=== Email Service Debug ===`
- Periksa apakah ada error message

### Di Vercel Production:
1. Buka Vercel Dashboard
2. Pilih project Anda
3. Buka tab "Functions" atau "Logs"
4. Cari log dari request `/api/auth/forgot-password`
5. Periksa error message

## 5. Common Issues

### Issue 1: "RESEND_API_KEY tidak ditemukan"
**Solusi:**
- Pastikan `RESEND_API_KEY` sudah di-set di environment variables
- Restart server setelah menambahkan environment variable
- Di Vercel, pastikan sudah di-set di Environment Variables settings

### Issue 2: "EMAIL_FROM tidak ditemukan"
**Solusi:**
- Tambahkan `EMAIL_FROM=onboarding@resend.dev` ke environment variables
- Restart server setelah menambahkan

### Issue 3: "Resend API error: Unauthorized"
**Solusi:**
- API key tidak valid atau sudah expired
- Buat API key baru di Resend Dashboard
- Update `RESEND_API_KEY` di environment variables

### Issue 4: "Resend API error: Domain not verified"
**Solusi:**
- Jika menggunakan custom domain, verifikasi domain terlebih dahulu
- Atau gunakan `onboarding@resend.dev` untuk testing

### Issue 5: Email masuk ke spam
**Solusi:**
- Verifikasi domain di Resend
- Setup SPF, DKIM, dan DMARC records
- Gunakan domain verified sebagai EMAIL_FROM

## 6. Testing

### Test di Local Development:
1. Pastikan `.env.local` sudah di-set dengan benar
2. Restart Next.js server
3. Coba request lupa password
4. Cek console log untuk melihat OTP (jika email gagal terkirim)
5. Cek email inbox `educorner.my.id@gmail.com`

### Test di Production:
1. Pastikan environment variables sudah di-set di Vercel
2. Redeploy aplikasi jika perlu
3. Coba request lupa password
4. Cek Vercel logs untuk error
5. Cek email inbox `educorner.my.id@gmail.com`

## 7. Debug Mode

Untuk development, jika email tidak terkirim, OTP akan muncul di console log:
```
⚠️ OTP untuk development/testing: 123456
```

Anda bisa menggunakan OTP ini untuk testing, tapi pastikan untuk memperbaiki konfigurasi email sebelum production.

## 8. Verifikasi Email Terkirim

Setelah memperbaiki konfigurasi:
1. Request lupa password dengan email `educorner.my.id@gmail.com`
2. Cek inbox email (termasuk folder spam)
3. Jika masih tidak terkirim, cek Vercel logs untuk error detail

## 9. Kontak Support

Jika masih bermasalah setelah mengikuti langkah-langkah di atas:
1. Cek Resend Dashboard untuk melihat status email
2. Cek Vercel logs untuk error detail
3. Pastikan semua environment variables sudah benar
4. Hubungi support jika diperlukan
