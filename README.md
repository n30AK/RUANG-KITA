# RUANG KITA

Platform komunitas digital yang melengkapi WhatsApp, bukan menggantikannya. Setiap komunitas memiliki ruang digital untuk agenda, pengumuman, pustaka, rapat eksternal, dan keanggotaan.

## Prinsip proyek

- Target biaya awal: Rp0 dengan batas paket gratis; tidak menjanjikan operasional tanpa batas.
- GitHub adalah pusat source code dan CI/CD.
- Neon adalah database PostgreSQL.
- Jangan simpan password, connection string, API key, atau token di repository.
- Jangan menyatakan aplikasi production-ready sebelum autentikasi, otorisasi multi-tenant, pengujian, backup/restore, dan deployment diverifikasi.

## MVP

1. Profil pengguna dan komunitas
2. Keanggotaan dan undangan yang dapat dicabut/kedaluwarsa
3. Pengumuman
4. Agenda dan RSVP
5. Pustaka komunitas (dokumen, FAQ, notulen, podcast/video via tautan)
6. Link berbagi komunitas dan integrasi kalender
7. Audit log dan pelaporan konten

## Database

Migration awal: `database/migrations/0001_initial_schema.sql`.

Migration ini adalah rancangan skema awal dan **belum diterapkan** ke database Neon. Sebelum menerapkan:
- Konfirmasi pemetaan ID pengguna ke Neon Auth.
- Implementasikan pemeriksaan otorisasi di backend untuk setiap operasi berdasarkan membership/role dan community_id.
- Tambahkan dan uji RLS jika akses database akan diberikan langsung ke role aplikasi.
- Buat migration yang dapat diulang/ditinjau dan uji pada branch pengembangan sebelum production.

## Status

Fondasi database dirancang. UI, backend API, auth flow, security tests, dan deployment masih harus dibangun dan diverifikasi.
