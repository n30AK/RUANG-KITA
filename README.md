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

## Status deployment aktif — RUANG KITA Next (2026-10-14)

- **Aplikasi aktif:** https://ruang-kita-next.hatchable.site
- **Deployment:** Hatchable v20 — live, visibilitas public.
- **3D engine:** Three.js r164, satu World Engine dengan scene ANGKRINGAN KITA, CAFE KITA, dan PANTAI KITA.
- **Pengujian v20:** 11/11 self-test lulus pada ketiga scene; model glTF animasi sintetis berhasil dimuat, diputar, dan dibersihkan; gerak keyboard berhasil diuji; tidak ada error browser pada sesi penerimaan.
- **Laporan bukti dan batasan:** [RUANG KITA Next Runtime Verification](docs/RUANG_KITA_NEXT_RUNTIME_STATUS_2026-10-14.md).

RUANG KITA Next adalah target pengembangan aktif. Runtime AI dan collision saat ini mengandalkan logika lokal deterministik; integrasi Babylon.js/Godot dilakukan melalui aset glTF/GLB, bukan penggabungan runtime penuh. Uji aset produksi berlisensi, stress test jangka panjang, perangkat mobile fisik, dan multiplayer masih menjadi pekerjaan lanjutan.

## Status deployment RUANG KITA Legacy — FROZEN (2026-10-14)

- Aplikasi hosted: https://ruang-kita.hatchable.site
- Ruang 3D: https://ruang-kita.hatchable.site/ruang-3d.html
- Deployment hosted yang diverifikasi: Hatchable v69 (runtime aktif per 14 Oktober 2026).
- Source scene 3D yang disinkronkan ke repository: `public/ruang-3d.html`.
- Laporan runtime, hasil smoke test, batasan, dan pekerjaan berikutnya: [docs/3d-runtime-status.md](docs/3d-runtime-status.md).
- Keputusan arsitektur engine 3D: [ADR-0001](docs/adr/0001-3d-engine-interoperability.md).

**Catatan legacy:** deployment v69 dipertahankan sebagai proyek lama yang dibekukan dan terpisah dari Next. Aplikasi legacy berstatus personal/private sehingga URL langsung menampilkan sign-in wall kepada pengunjung anonim. Untuk akses publik, gunakan aplikasi aktif RUANG KITA Next di atas.



## Master build specification

Dokumen kerja utama v3.0 mengintegrasikan spesifikasi produk asli dengan interoperabilitas Three.js/Babylon.js/Godot melalui glTF/GLB, simulasi collision dan navigasi, diagnostik rendering, multi-agent world intelligence, serta quality gates dan pelaporan berbasis bukti.

- [RUANG KITA — Master Build Specification v3.0](docs/RUANG_KITA_MASTER_BUILD_SPECIFICATION_v3.0.md)
- [Legacy 3D runtime verification report](docs/3D_RUNTIME_VERIFICATION_2026-10-14.md)
- [RUANG KITA Next runtime verification](docs/RUANG_KITA_NEXT_RUNTIME_STATUS_2026-10-14.md)
- Dunia aktif: https://ruang-kita-next.hatchable.site
- Dunia 3D legacy (private/frozen): https://ruang-kita.hatchable.site/ruang-3d.html
