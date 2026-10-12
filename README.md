# RUANG KITA — Ruang Silaturahmi Digital

RUANG KITA adalah ruang digital komunitas yang melengkapi WhatsApp, bukan menggantikannya. Pengguna dapat membuat ruang publik/privat, mengundang anggota, mengatur agenda, dan membagikan pengumuman.

## Status saat ini

- **Runtime publik:** https://ruang-kita.hatchable.site
- **Hatchable deployment:** v7 (12 Oktober 2026)
- **Fitur inti live:** autentikasi email OTP/passkey platform, pembuatan komunitas, pengaturan akses publik/privat/undangan, penemuan dan gabung komunitas publik, undangan berbatas waktu/penggunaan, agenda, RSVP, halaman detail komunitas, pengumuman.
- **Source runtime Hatchable:** folder [hatchable-runtime/](hatchable-runtime/). Ini mirror untuk review/backup; belum ada deployment otomatis dari GitHub Actions ke Hatchable.
- **UI Next.js prototype:** source prototype awal tetap ada pada root aplikasi untuk referensi visual dan pengembangan lebih lanjut.

## Dokumen proyek

- [Blueprint RUANG KITA v2.0](docs/BLUEPRINT-RUANG-SILATURAHMI-V2.md)
- [Rencana implementasi MVP](docs/MVP-IMPLEMENTATION-PLAN.md)
- [Persyaratan delapan modul komunitas](docs/PRODUCT-REQUIREMENTS-EIGHT-COMMUNITY-MODULES.md)

## Prinsip biaya dan keamanan

- Target awal Rp0 menggunakan free tiers; kuota gratis dapat berubah dan tidak berarti tanpa batas.
- Jangan simpan token, password, connection string, atau file `.env` di repository.
- Privasi ruang privat harus diperiksa pada server; menyembunyikan tombol di browser bukan kontrol keamanan.
- Neon production belum diubah oleh deployment Hatchable ini.
- Kebijakan Privasi dan Ketentuan Penggunaan pada runtime masih draf operasional; lengkapi kontak pengendali data dan tinjauan hukum sebelum penggunaan luas.

## Belum aktif

Podcast upload/live audio, direktori anggota opt-in, marketplace transaksi, asisten AI, dana sosial/pembayaran, konferensi video terintegrasi, dan sistem moderasi/pelaporan lengkap masih menjadi fase lanjutan. Kartu-kartu contoh pada landing page tetap ilustrasi, bukan komunitas nyata.
