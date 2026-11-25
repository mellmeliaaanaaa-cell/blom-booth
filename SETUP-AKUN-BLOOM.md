# Aktivasi akun Bloom Booth (sekali setup)

## 1. Buat project Supabase
1. Buka https://supabase.com dan buat project baru.
2. Buka **Project Settings → API**. Salin **Project URL** dan **anon/public key**.
3. Di folder proyek, salin `.env.example` menjadi `.env.local`, lalu isi kedua nilai tadi.

## 2. Aktifkan penguncian perangkat
1. Di Supabase buka **SQL Editor → New query**.
2. Buka file `supabase/device-lock.sql`, salin seluruh isinya, tempel ke SQL Editor, lalu tekan **Run**.

## 3. Buat akun pelanggan
1. Buka **Authentication → Users → Add user → Create new user**.
2. Masukkan email dan password yang kamu berikan kepada pembeli.
3. Buat satu akun berbeda untuk setiap pembeli. Jangan berikan password admin.

## 4. Deploy
1. Upload seluruh isi folder proyek ini ke repository GitHub Bloom Booth.
2. Di Vercel buka project → **Settings → Environment Variables**.
3. Tambahkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan nilai dari langkah 1.
4. Redeploy project.

## Cara kerja
- Halaman `/booth` dan `/frames` meminta login.
- Login pertama mengikat akun ke ID browser/perangkat yang tersimpan di localStorage.
- Login akun yang sama di browser/perangkat lain ditolak.
- Jika pembeli mengganti browser, menghapus data situs, atau reset perangkat, admin perlu menghapus baris akun itu dari tabel `bloom_device_locks` agar perangkat baru bisa didaftarkan.

## Batasan
Penguncian ini mengikat akun ke identitas browser yang tersimpan, bukan nomor seri perangkat fisik. Pengguna yang menghapus data situs atau memakai browser berbeda dapat meminta pengikatan ulang. Jangan menghapus lock kecuali setelah memverifikasi pembeli.
