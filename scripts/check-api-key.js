// Script untuk memverifikasi GROQ_API_KEY
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

console.log('=== Pemeriksaan GROQ_API_KEY ===\n');

if (!fs.existsSync(envPath)) {
  console.error('❌ File .env.local tidak ditemukan!');
  console.log('Lokasi yang dicari:', envPath);
  process.exit(1);
}

// Baca file .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let groqKey = null;
let groqKeyLine = null;

lines.forEach((line, index) => {
  if (line.trim().startsWith('GROQ_API_KEY=')) {
    groqKey = line.split('=')[1]?.trim() || '';
    groqKeyLine = index + 1;
  }
});

console.log('📁 File .env.local ditemukan:', envPath);
console.log('📋 Baris GROQ_API_KEY:', groqKeyLine || 'Tidak ditemukan');
console.log('');

if (!groqKey) {
  console.error('❌ GROQ_API_KEY tidak ditemukan di file .env.local!');
  console.log('\n💡 Tambahkan baris berikut ke file .env.local:');
  console.log('GROQ_API_KEY=gsk_your_actual_api_key_here');
  process.exit(1);
}

console.log('✅ GROQ_API_KEY ditemukan');
console.log('📏 Panjang API key:', groqKey.length, 'karakter');
console.log('🔤 Prefix:', groqKey.substring(0, 4));
console.log('🔤 Suffix:', groqKey.length > 4 ? '...' + groqKey.substring(groqKey.length - 4) : '');
console.log('');

// Validasi
if (groqKey === 'gsk_your_api_key_here') {
  console.error('❌ ERROR: API key masih menggunakan placeholder!');
  console.log('\n💡 Langkah-langkah:');
  console.log('1. Kunjungi: https://console.groq.com/');
  console.log('2. Login dan buat API key baru');
  console.log('3. Ganti gsk_your_api_key_here dengan API key yang sebenarnya');
  console.log('4. Restart server dengan: npm run dev');
  process.exit(1);
}

if (groqKey.length < 20) {
  console.error('❌ ERROR: API key terlalu pendek!');
  console.log('API key Groq biasanya lebih dari 40 karakter.');
  console.log('Pastikan Anda sudah menyalin API key dengan lengkap.');
  process.exit(1);
}

if (!groqKey.startsWith('gsk_')) {
  console.warn('⚠️  WARNING: API key tidak dimulai dengan "gsk_"');
  console.log('API key Groq biasanya dimulai dengan "gsk_"');
  console.log('Pastikan Anda menggunakan API key dari Groq, bukan provider lain.');
}

console.log('✅ API key terlihat valid!');
console.log('');
console.log('💡 Jika masih error 401:');
console.log('   1. Pastikan server sudah di-restart setelah mengubah .env.local');
console.log('   2. Pastikan tidak ada spasi tambahan di sekitar tanda =');
console.log('   3. Pastikan API key dari Groq masih aktif');
console.log('   4. Cek console server untuk error details');
