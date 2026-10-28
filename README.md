# Bloom Booth

Photobooth online: strip 4 foto atau kolase 6 foto, 20 frame di 5 koleksi, filter, stiker, teks, unduh PNG/JPG.
Semua diproses di browser. Tidak ada database, login, atau upload foto.

Teknologi: Next.js 15 (App Router), TypeScript, Tailwind CSS 3, Lucide React, Canvas API, MediaDevices API.

## Jalankan di komputer

Butuh Node.js 18.18 atau lebih baru.

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Kamera berfungsi di `localhost` meskipun tanpa HTTPS.
Cek build produksi sebelum deploy: `npm run build`

## Upload ke GitHub

1. Buat repository kosong di github.com (tanpa README).
2. Di folder proyek:

```bash
git init
git add .
git commit -m "Bloom Booth pertama"
git branch -M main
git remote add origin https://github.com/USERNAME/bloom-booth.git
git push -u origin main
```

## Deploy ke Vercel

1. Login ke vercel.com (boleh pakai akun GitHub).
2. Add New > Project > pilih repository `bloom-booth` > Import.
3. Framework otomatis terdeteksi Next.js. Tidak perlu environment variable. Klik Deploy.
4. Setelah selesai, kamu dapat link `https://nama-proyek.vercel.app` yang bisa dibuka siapa saja lewat HTTPS.
   Setiap `git push` ke `main` akan men-deploy ulang otomatis.

## Uji kamera

1. Buka link Vercel di HP (Chrome/Safari) dan di laptop.
2. Masuk Studio Foto, tekan Aktifkan Kamera, pilih Izinkan.
3. Coba kedua mode (4 dan 6 foto), tiap timer, ganti kamera, retake, lalu unduh PNG dan JPG.

Jika izin gagal:
- Chrome/Edge: klik ikon gembok di address bar > Kamera > Izinkan > muat ulang.
- Safari iPhone: Pengaturan > Safari > Kamera > Tanya/Izinkan.
- Kamera dipakai aplikasi lain (Zoom, Meet)? Tutup dulu.
- Dibuka dari Instagram/TikTok/WhatsApp? Buka lewat Chrome atau Safari biasa.
- Tidak ada kamera? Pakai tombol "Pakai foto dari galeri".

## Struktur

- `app/` halaman: beranda, `/booth` (studio), `/frames` (galeri)
- `components/booth` alur sesi, kamera, countdown; `components/result` edit dan unduh; `components/frame` pemilih & kustomisasi frame
- `lib/compose.ts` satu-satunya mesin render (preview = unduhan); `lib/frames/*` preset frame; `lib/stickers/draw.ts` semua dekorasi digambar lewat kode
- `hooks/` `useCamera`, `useSession`, `useDraggable`

## Keterbatasan

- Foto hanya ada di memori browser: refresh halaman menghapus sesi (ada peringatan sebelum menutup).
- Pilihan kamera mengikuti perangkat yang terdeteksi browser. Kamera HP yang tersambung ke laptop tidak otomatis muncul.
- Hasil HD (2x) pada HP lama bisa lambat; pakai Standar jika gagal.
- Tombol unduh di sebagian iPhone/in-app browser bisa tidak jalan; gunakan tombol Bagikan.
- Dekorasi superhero adalah desain orisinal (bukan logo/karakter berhak cipta).
