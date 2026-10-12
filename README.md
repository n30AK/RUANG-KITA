# RUANG KITA — Ruang Silaturahmi Digital

RUANG KITA adalah rumah digital komunitas yang melengkapi WhatsApp, bukan menggantikannya. Pengguna dapat memilih suasana ruang, berkumpul pada meja komunitas, berbagi agenda/pustaka, mengikuti pertemuan, dan mengunjungi pameran lintas komunitas.

## Arah produk yang disepakati

- **Visual hybrid 2D → 3D:** MVP dimulai dari scene 2D interaktif yang ringan dan responsif; 3D adalah fase lanjutan.
- **Video meeting dua jalur:** tautan eksternal terlebih dahulu; video terintegrasi menyusul setelah evaluasi teknis, biaya, kapasitas, dan privasi.
- **Akses hybrid:** room publik dapat dikunjungi sesuai pengaturan; room privat membutuhkan undangan/keanggotaan. Privasi meja dan konten tetap ditegakkan.
- **Target biaya awal Rp0:** gunakan free tiers dan data demo selama pengembangan. Kuota gratis dapat berubah; tidak ada janji layanan gratis tanpa batas.
- **GitHub-first:** source code, review, dan CI/CD dikelola di GitHub; Neon PostgreSQL adalah database.

## Prototype UI

Aplikasi Next.js pada branch `feat/ruang-silaturahmi-mvp` menampilkan:
- pemilih scene Kafe, Angkringan, Pendopo, dan Expo Hall;
- pratinjau room 2D dan meja komunitas;
- katalog room dengan filter publik/undangan;
- ilustrasi meja, expo hall, dan alur dari WhatsApp;
- tata letak responsif dengan label jelas bahwa data adalah demo.

**Peringatan:** prototype UI menggunakan data statis. Belum ada autentikasi, database runtime, undangan nyata, video call, AI scene generation, atau deployment production. Tombol demo tidak membuat room/akun sungguhan.

## Dokumen

- [Blueprint Ruang Silaturahmi Digital v2.0](docs/BLUEPRINT-RUANG-SILATURAHMI-V2.md)
- [Rencana implementasi MVP](docs/MVP-IMPLEMENTATION-PLAN.md)
- [Migration skema awal (belum diterapkan)](database/migrations/0001_initial_schema.sql)

## Database dan keamanan

Migration awal **belum diterapkan** ke Neon. Database saat ini berisi tabel sistem Neon Auth; tabel aplikasi belum dibuat. Sebelum membuat migration berikutnya:
1. Buat dan gunakan branch development terpisah.
2. Verifikasi pemetaan ID/session Neon Auth ke profil aplikasi.
3. Review model data room, room membership, tables, invitations, sessions dan scene presets.
4. Terapkan migration hanya pada development branch; uji constraints, auth, privasi, tenant isolation dan restore.
5. Minta persetujuan eksplisit sebelum migration production.

Jangan simpan connection string, password, API key, token, atau file `.env` di repository. Setiap operasi data harus mendapat pemeriksaan otorisasi server-side; menyembunyikan tombol di UI bukan kontrol keamanan.

## Cara menjalankan prototype lokal

Persyaratan: Node.js yang kompatibel dengan Next.js dan npm.

```bash
npm install
npm run dev
```

Buka alamat lokal yang dicetak Next.js. Untuk pemeriksaan:

```bash
npm run typecheck
npm run lint
npm run build
```

Pemeriksaan tersebut belum dijalankan oleh commit ini. Jangan menganggap build atau deployment berhasil sebelum CI memberi hasil nyata.

## Status

Prototype UI dan blueprint ada di branch fitur; belum digabungkan ke `main`, belum terkoneksi ke Neon, dan belum live. GitHub Pages saja tidak dapat menjalankan backend dinamis Next.js; hosting harus dipilih dan diverifikasi sebelum go-live.
