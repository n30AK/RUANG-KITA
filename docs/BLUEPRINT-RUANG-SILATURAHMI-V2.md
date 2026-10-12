# RUANG KITA — Blueprint Ruang Silaturahmi Digital v2.0

Tanggal: 12 Oktober 2026  
Status: arah produk disepakati; implementasi bertahap; belum production.

## 1. Visi produk

RUANG KITA adalah rumah digital untuk komunitas yang melengkapi WhatsApp, bukan menggantikannya. Pengguna tidak hanya membuka halaman informasi, tetapi memasuki ruang virtual yang punya suasana, area, meja, agenda, pustaka, dan aktivitas bersama.

## 2. Keputusan produk yang ditetapkan

- **Visual:** hybrid 2D menuju 3D. MVP menggunakan scene 2D interaktif yang ringan dan responsif; arsitektur UI memisahkan data room/meja dari renderer agar scene 3D dapat ditambahkan kelak.
- **Video:** dua jalur. MVP mendukung tautan eksternal yang disediakan penyelenggara. Video terintegrasi dirancang sebagai fase berikutnya setelah evaluasi penyedia, biaya, privasi, kapasitas, dan kebutuhan perangkat.
- **Akses:** hybrid publik dan privat. Room publik dapat ditemukan/dikunjungi sesuai aturan; room privat memerlukan undangan atau keanggotaan. Meja dan konten dapat memiliki aturan akses yang lebih ketat daripada room induk.
- **Budget:** target awal Rp0 menggunakan free tiers dan layanan yang sudah tersedia; tidak ada janji gratis tanpa batas. Jangan membuat penggunaan layanan berbayar atau mengaktifkan fitur berbayar tanpa persetujuan.
- **Workflow:** GitHub adalah sumber kode dan review utama; Neon PostgreSQL adalah database. Jangan menjalankan migrasi atau menulis skema ke branch production secara langsung.

## 3. Model mental produk

- **Room:** lingkungan/venue digital, misalnya Kafe Silaturahmi, Angkringan, Pendopo, Ruang Rapat, Taman, atau Expo Hall.
- **Table:** ruang milik sebuah komunitas/aktivitas. Secara default satu meja mewakili satu komunitas atau grup WhatsApp, tetapi bukan koneksi otomatis ke grup WhatsApp.
- **Seat:** slot/representasi kehadiran anggota dalam scene atau sesi. Seat bukan jaminan bahwa audio/video tersedia.
- **Session:** kegiatan terjadwal atau sementara di dalam room/meja, misalnya diskusi, rapat, kelas, reuni, atau presentasi.
- **Scene:** tema visual, aset latar, palet warna, dekorasi, serta konfigurasi tata letak.
- **Expo booth:** jenis meja khusus untuk karya, katalog, portofolio, demo, layanan, atau presentasi komunitas.

Room yang sama dapat menampung banyak meja dari komunitas berbeda. Satu komunitas dapat memiliki meja di lebih dari satu room. Berbagi venue tidak boleh membuat percakapan, anggota, undangan, atau konten privat ikut terbagi.

## 4. Scene awal

1. **Kafe Komunitas** — meja komunal, tanaman, lampu hangat, diskusi dan networking.
2. **Angkringan** — suasana santai Nusantara untuk obrolan informal.
3. **Pendopo Nusantara** — musyawarah, keluarga, desa, alumni, kegiatan sosial.
4. **Ruang Konferensi** — agenda rapat, presentasi, moderator, catatan keputusan.
5. **Taman Silaturahmi** — ruang publik yang tenang untuk percakapan dan pertemuan.
6. **Expo Hall / Galeri** — stan pameran yang bisa dikunjungi peserta dari berbagai komunitas.\n7. **Panggung Karaoke Komunitas** — panggung untuk anggota dari satu atau beberapa komunitas bergabung sebagai penampil atau penonton, dengan daftar tampil dan moderator.

MVP menggunakan ilustrasi/layout 2D ringan, bukan dunia 3D penuh. Scene harus tetap usable di layar kecil, keyboard, koneksi lambat, dan perangkat berkemampuan rendah.\n\n### Panggung Karaoke Komunitas\n- Room karaoke dapat menjadi room mandiri atau venue gabungan yang mengundang beberapa komunitas/grup WhatsApp; identitas, keanggotaan, dan konten privat tiap komunitas tetap terpisah.\n- Peran sesi: host/moderator, penampil yang mendaftar, dan penonton. Antrean tampil, judul lagu, urutan giliran, dan reaksi/apresiasi merupakan fitur produk yang direncanakan.\n- MVP boleh menampilkan scene dan alur daftar tampil sebagai prototipe; pemutaran lagu, sinkronisasi audio, mikrofon, live video, dan karaoke bersama belum dianggap tersedia sampai diimplementasikan dan diuji.\n- Gunakan audio/lagu yang berizin atau sumber yang pemakaiannya diperbolehkan. Jangan mengunggah atau menyiarkan ulang backing track, lirik, atau rekaman berhak cipta tanpa hak yang sesuai. Sediakan aturan komunitas, pelaporan, mute/kick, dan kontrol moderator.\n- Jika kelak memakai video/audio real-time, evaluasi penyedia, bandwidth, batas peserta, moderasi, consent, dan biaya terlebih dahulu; jangan mengaktifkan layanan berbayar tanpa persetujuan.

## 5. MVP — fitur prioritas

### P0: fondasi
- Landing page dan katalog room publik.
- Room detail dengan scene 2D dan tata letak meja.
- Membuat komunitas/meja, mengubah nama dan deskripsi, mengatur publik/privat.
- Identitas pengguna dan autentikasi sebelum operasi terlindungi.
- Undangan berbatas waktu dan dapat dicabut; kode/token hanya disimpan sebagai hash.
- Role: owner, admin, moderator, member.
- Pustaka dasar, pengumuman, agenda dan RSVP.
- Tautan berbagi dan pesan undangan siap salin ke WhatsApp.
- Tautan meeting eksternal yang divalidasi dan ditampilkan sesuai izin.
- Desain responsif dan seluruh UI utama berbahasa Indonesia.

### P1: kolaborasi
- Room lintas komunitas dengan daftar peserta dan aturan per meja.
- Expo Hall dengan booth publik, item katalog/portofolio dan tautan kontak.\n- Scene Panggung Karaoke: jadwal/antrean tampil, persetujuan moderator, penonton, serta reaksi sederhana; audio/video langsung tetap di luar lingkup sampai provider dipilih dan diuji.
- Export kalender (.ics), pencarian konten dan pelaporan.
- Audit event untuk tindakan penting.

### P2: komunikasi imersif
- Video call terintegrasi melalui penyedia yang dipilih setelah evaluasi.
- AI Scene Studio: deskripsi teks → konsep/variasi scene; moderasi dan persetujuan sebelum publikasi.
- AI notulen/ringkasan hanya dengan pemberitahuan dan persetujuan peserta.
- Eksperimen avatar, audio berbasis jarak dan renderer 3D setelah validasi performa serta biaya.

## 6. Video meeting dan AI

Tautan eksternal adalah jalur awal yang hemat biaya dan tidak mengharuskan RUANG KITA meng-host media. Validasi skema URL, batasi akses sesuai privasi, dan jangan mengklaim meeting berhasil jika hanya menampilkan tautan.

Video terintegrasi memerlukan evaluasi WebRTC/SFU atau layanan pihak ketiga, biaya bandwidth, TURN, batas peserta, browser mobile, moderasi, perekaman, dan kebijakan privasi. Jangan menanam API key/server secret di browser atau GitHub.

AI Scene Studio pada awalnya dapat menghasilkan konsep dan aset statis; sistem harus mengontrol ukuran, format, keamanan, hak penggunaan, moderasi, dan biaya. Jangan membuat pemanggilan model berbayar aktif tanpa persetujuan.

## 7. Akses, privasi dan moderasi

- Room publik: dapat dilihat tanpa login hanya pada konten yang memang ditetapkan publik; aksi menulis/RSVP/mengikuti memerlukan autentikasi.
- Room privat/invite-only: tidak boleh mengungkap nama anggota, agenda, konten, atau keberadaan meja privat kepada pengunjung yang tidak berwenang.
- Hak akses diperiksa di server pada setiap operasi, bukan hanya menyembunyikan tombol UI.
- Keanggotaan room dan keanggotaan komunitas/meja dipisahkan.
- Undangan mempunyai expiry, revoke, batas penggunaan jika diperlukan, dan token acak berentropi tinggi yang disimpan sebagai hash.
- Meeting URL, unggahan, dan media tidak otomatis publik.
- Sediakan report/moderation, audit log, consent notice, kebijakan privasi, retensi dan penghapusan data.
- Uji akses allow/deny antar-tenant; jangan mengandalkan UUID yang sulit ditebak sebagai kontrol keamanan.
- Jangan menyimpan data pribadi berlebihan. Evaluasi kepatuhan UU PDP Indonesia sebelum pilot publik.

## 8. Arsitektur awal

- Web: Next.js + TypeScript, responsive mobile-first, PWA-ready.
- Data: Neon PostgreSQL; skema aplikasi hanya setelah migrasi diuji pada branch development.
- Auth: Neon Auth/Managed Better Auth bila sesuai konfigurasi. Petakan subject/ID dari sesi auth ke profiles secara eksplisit; jangan menebak format ID.
- Server: server actions/API route dengan validasi input dan pemeriksaan role/membership per request.
- UI scene: komponen scene terpisah dari data room/table/session; 2D terlebih dahulu.
- CI: lint, typecheck, unit/security tests dan build di GitHub Actions.
- Hosting: pilih opsi free tier setelah memeriksa kompatibilitas dan kuota; GitHub sendiri bukan host untuk aplikasi dinamis. Tidak ada klaim live sebelum deployment diuji.

## 9. Entitas data yang dibutuhkan

Entitas yang telah dirancang dalam migration awal: profiles, communities, memberships, invitations, announcements, events, event_rsvps, content_items, media_assets, audit_logs, reports, user_consents.

Entitas tambahan yang dibutuhkan untuk konsep ruang:
- rooms: venue, slug, visibility, owner, scene_id/config, status.
- room_memberships: role dan status pengguna pada room.
- tables: room_id, community_id opsional, nama, kapasitas visual, visibility, posisi/layout, tipe (community/discussion/booth).
- room_invitations: undangan lintas komunitas ke room, expiry/revocation.
- sessions: aktivitas, waktu, host, mode (discussion/meeting/expo/class), meeting provider/link dan visibility.
- scene_presets: tema yang disetujui dan konfigurasi aset.
- booths/items: jika tidak dimodelkan sebagai tables/content_items dengan tipe khusus.

Sebelum membuat migration berikutnya, review normalisasi dan aturan kepemilikan. Hindari duplikasi identitas anggota; foreign key ke profil hanya setelah mapping Auth diverifikasi. Terapkan migration di branch pengembangan terlebih dahulu dan uji rollback/restore.

## 10. Tahapan dan kriteria selesai

1. **Product/UI prototype:** scene 2D dan navigasi dapat dicoba dengan data contoh yang jelas berlabel demo.
2. **Database/auth:** mapping identitas diverifikasi; migration diuji pada development branch; tidak ada perubahan production.
3. **Community/room:** operasi CRUD terotorisasi dan tes lintas tenant lulus.
4. **Agenda/library/invitation:** expiry, revoke, visibilitas, RSVP dan tautan diuji.
5. **Expo/public-private:** uji pengunjung publik dan anggota privat.
6. **Release candidate:** lint/typecheck/build, tes keamanan, aksesibilitas, responsif, backup/restore, kebijakan privasi, dan observabilitas.
7. **Deployment:** hanya dinyatakan live setelah URL deployment nyata dan endpoint health diuji.

## 11. Target pilot

Target awal untuk diuji bersama 5–10 komunitas pilot, bukan klaim pengguna aktif. Ukur keberhasilan dari waktu masuk room, keberhasilan menerima undangan, jumlah RSVP, kunjungan booth, stabilitas mobile, dan laporan pelanggaran. Angka target dapat direvisi berdasarkan hasil pilot.

## 12. Di luar cakupan MVP

- Membaca atau mengelola isi grup WhatsApp biasa secara otomatis.
- Menjamin jumlah peserta video tanpa evaluasi layanan.\n- Karaoke streaming/audio real-time, katalog lagu berlisensi, dan sinkronisasi lirik pada MVP awal.
- Dunia 3D penuh atau audio spasial.
- Marketplace pembayaran, dompet, dan transfer dana.
- Generasi AI berbayar aktif secara default.

Semua fitur ini memerlukan keputusan, biaya, izin, serta pengujian tambahan.
