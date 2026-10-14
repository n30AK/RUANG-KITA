# RUANG KITA Next

Proyek baru berdasarkan `RUANG_KITA_MASTER_BUILD_SPECIFICATION_v3.0`. Terpisah dari **RUANG KITA LEGACY — FROZEN**.

## Status implementasi
- Fase berjalan: Phase 2 — Community foundation.
- Phase 1: browser 3D, Three.js renderer, tiga scene konfigurasi, avatar prosedural, keyboard movement, kamera orbit, collision lokal dasar; browser smoke test lulus.
- Phase 2: passwordless email auth dikonfigurasi; tabel rooms, members, messages, invites; API membuat ruang, join, kirim/baca pesan, undangan, dan token realtime.
- Ruang publik awal: Angkringan Kita.
- API diuji dengan test-user sintetis: akses anonim ditolak (401), create room, message write/read, invite creation, dan event token berhasil; data ruang QA dibersihkan setelah tes.
- **NOT TESTED:** pengiriman email/login pengguna nyata, chat realtime dua browser, penerimaan undangan dengan akun kedua, serta multiplayer avatar sync.
- Antarmuka Bahasa Indonesia.
- AI multi-agent, marketplace, pembayaran, physics engine penuh, dan integrasi runtime Babylon.js/Godot belum diaktifkan.

## Menjalankan
Static frontend disajikan dari `public/`. File `public/index.html` memuat import map dan `public/app.js`. Engine dimuat sebagai ES module dari CDN; akses internet dan WebGL diperlukan.

## Batasan MVP
- Lingkungan dibuat secara prosedural; belum menggunakan katalog model/tekstur eksternal.
- Gerakan/collision adalah simulasi lokal sederhana, bukan physics engine penuh atau simulasi dunia nyata.
- Belum ada persistensi posisi, akun, presence, chat, atau sinkronisasi antar-browser.
- Tidak ada panggilan LLM per frame.
- Aset dari Babylon.js/Godot belum diimpor. Interoperabilitas glTF/GLB akan dievaluasi setelah rendering dasar terverifikasi.

## Quality gate
1. Dry-run deploy tanpa error.
2. Browser memuat halaman, modul Three.js, WebGL context, dan tiga scene.
3. Console bebas error fatal saat startup dan perpindahan scene.
4. Avatar bergerak dan collider statis menghentikan penetrasi dasar.
5. Resize viewport tidak merusak canvas.
6. Tes yang tidak dijalankan harus diberi label NOT TESTED.

Lihat `/architecture.html` untuk keputusan arsitektur.