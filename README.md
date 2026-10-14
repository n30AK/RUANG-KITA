# RUANG KITA Next

Proyek baru berdasarkan `RUANG_KITA_MASTER_BUILD_SPECIFICATION_v3.0`. Terpisah dari **RUANG KITA LEGACY — FROZEN**.

## Status implementasi
- Fase: Phase 1 — Browser 3D MVP.
- World engine: Three.js, satu renderer.
- Scene konfigurasi: Angkringan Kita, Cafe Kita, Pantai Kita.
- Avatar 3D prosedural, kontrol keyboard, kamera orbit sederhana, dan collision lokal dasar.
- Antarmuka Bahasa Indonesia.
- Akun, chat, multiplayer, database komunitas, model AI, marketplace, dan pembayaran: belum diaktifkan.

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