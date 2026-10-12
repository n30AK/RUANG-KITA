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
6. **Expo Hall / Galeri** — stan pameran yang bisa dikunjungi peserta dari berbagai komunitas.\n7. **Panggung Karaoke Komunitas** — panggung untuk penampil dan penonton lintas komunitas, dengan antrean dan moderator.
8. **Orang Tua & Sekolah** — papan pengumuman, kalender kelas, tugas/berkas, RSVP pertemuan, relawan, dan kanal per kelas.
9. **Ruang Keluarga** — agenda keluarga, acara, album/arsip berbagi yang aksesnya dibatasi, dan daftar kebutuhan.
10. **Kantor & Proyek** — ruang rapat, daftar tugas, pemilik tugas, keputusan, tenggat, dan catatan rapat.
11. **Warga & Lingkungan** — kalender ronda/kegiatan, laporan fasilitas, pengumuman warga, serta pencatatan iuran yang transparan bila diaktifkan.
12. **Komunitas Ibadah** — agenda kegiatan, relawan, kelas, dan pengumuman dengan konfigurasi yang dipilih pengelola.
13. **Klub Olahraga** — jadwal latihan/pertandingan, RSVP, roster, hasil, dan koordinasi transportasi.
14. **Hobi & Kreator** — tantangan karya, galeri, sesi kritik, showcase, dan jadwal komunitas.
15. **Kelas & Belajar** — materi, tugas, sesi belajar, daftar hadir, dan tanya jawab.
16. **UMKM & Jual-Beli** — katalog, stan, formulir pesanan/permintaan, jadwal bazar, dan kontak penjual; transaksi tidak otomatis diproses.
17. **Relawan & Sosial** — pendaftaran relawan, pembagian tugas, kebutuhan barang, dan pelaporan kegiatan; donasi memerlukan kontrol keuangan terpisah.
18. **Wisata & Perjalanan** — itinerary, titik kumpul, checklist peserta, pengingat, dan kontak koordinator.
19. **Dukungan Komunitas** — ruang dukungan sebaya dengan akses ketat, tanpa menganggap AI sebagai tenaga profesional dan tanpa membuka data sensitif.
20. **Alumni & Reuni** — direktori sukarela, agenda reuni, mentoring, dan jejaring karier.

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

## 6. Fitur kontekstual berdasarkan jenis grup\n\nScene adalah preset pengalaman, bukan sekadar dekorasi. Pengelola dapat memilih modul yang relevan; modul yang tidak dipakai tidak perlu muncul. Contoh: sekolah mendapat kalender kelas, pengumuman dan relawan; warga mendapat agenda lingkungan dan pelaporan fasilitas; kantor mendapat tugas dan keputusan; UMKM mendapat katalog dan permintaan pesanan; olahraga mendapat jadwal dan RSVP. Setiap modul wajib memakai aturan akses per komunitas/room, pencatatan aktivitas penting, dan persetujuan sebelum notifikasi dikirim. Hindari mengumpulkan data anak, kesehatan, keuangan, atau data sensitif lebih dari yang diperlukan.\n\n## 7. Arsitektur multi-agent AI\n\nMulti-agent adalah asisten yang memiliki peran dan alat terbatas. Agent tidak otomatis mendapat akses ke semua data, tidak boleh meniru admin WhatsApp, dan tidak boleh mengirim pesan atau mengambil tindakan eksternal tanpa otorisasi. Untuk MVP, mulai dari rekomendasi/draf yang ditinjau manusia; konektor WhatsApp hanya jika kelak tersedia melalui API resmi yang sesuai kebijakan dan persetujuan pengguna.\n\n### Peran agent\n1. **Orchestrator / Koordinator** — menerima permintaan, menentukan agent yang relevan, menyusun hasil, menerapkan batas biaya dan meminta persetujuan untuk aksi berisiko.\n2. **Community Planner** — membantu pengelola memilih jenis komunitas, scene, modul, peran, dan aturan.\n3. **School & Family Agent** — membantu merancang kalender sekolah, agenda kelas, FAQ orang tua dan draf pengumuman; tidak membuat keputusan terkait anak.\n4. **Events & Scheduler Agent** — menyusun acara, RSVP, jadwal, pengingat, dan ekspor kalender; memeriksa benturan jadwal bila data tersedia.\n5. **Knowledge & Document Agent** — mengatur dokumen, FAQ, notulen dan pencarian berdasarkan izin akses; tidak membocorkan dokumen privat.\n6. **Task & Operations Agent** — membuat daftar tugas, penanggung jawab, tenggat dan ringkasan status untuk kantor, warga, relawan, atau panitia.\n7. **Marketplace & UMKM Agent** — membantu menyusun katalog, deskripsi produk dan draf respons calon pembeli; tidak memproses pembayaran tanpa sistem transaksi yang disetujui.\n8. **Engagement & Activity Agent** — menyarankan aktivitas yang sesuai seperti karaoke, olahraga, kelas, pameran, atau tantangan kreatif; rekomendasi tidak mengirim undangan otomatis.\n9. **Safety & Moderation Agent** — membantu menandai spam, pelecehan, penipuan atau pelanggaran aturan untuk ditinjau moderator; keputusan sanksi final tetap pada manusia.\n10. **Privacy & Access Agent** — memeriksa permintaan data, izin, retensi dan potensi kebocoran lintas komunitas; tidak menggantikan review keamanan.\n11. **Analytics Agent** — membuat ringkasan agregat tentang RSVP, kehadiran dan aktivitas yang memang diizinkan; hindari profiling sensitif.\n12. **WhatsApp Bridge Agent** — pada fase masa depan, menyiapkan pesan/tautan undangan dan mengelola integrasi resmi yang tersedia; tidak membaca chat pribadi atau semua grup secara diam-diam.\n\n### Aturan orkestrasi dan keamanan agent\n- Setiap agent memakai tool allowlist dan konteks minimum yang dibutuhkan; tenant/room ID dan role harus diverifikasi server-side.\n- Draf pesan, pengumuman, moderasi, publikasi, undangan massal, serta tindakan yang mengubah data memerlukan persetujuan manusia sesuai tingkat risikonya.\n- Catat siapa meminta, agent mana yang bekerja, data apa yang dipakai, keputusan dan hasil; jangan simpan chain-of-thought privat.\n- Data dari dokumen, pesan yang diimpor, dan konten pengguna dianggap input tak tepercaya, bukan instruksi sistem.\n- Dukung batas token/biaya, rate limit, fallback tanpa AI, penghapusan data, serta pengaturan untuk menonaktifkan agent per komunitas.\n- Jangan mengirim data anak, kesehatan, agama, atau data sensitif ke model eksternal tanpa dasar pemrosesan, pemberitahuan, dan persetujuan yang sesuai.\n\n## 8. Video meeting dan AI

Tautan eksternal adalah jalur awal yang hemat biaya dan tidak mengharuskan RUANG KITA meng-host media. Validasi skema URL, batasi akses sesuai privasi, dan jangan mengklaim meeting berhasil jika hanya menampilkan tautan.

Video terintegrasi memerlukan evaluasi WebRTC/SFU atau layanan pihak ketiga, biaya bandwidth, TURN, batas peserta, browser mobile, moderasi, perekaman, dan kebijakan privasi. Jangan menanam API key/server secret di browser atau GitHub.

AI Scene Studio pada awalnya dapat menghasilkan konsep dan aset statis; sistem harus mengontrol ukuran, format, keamanan, hak penggunaan, moderasi, dan biaya. Jangan membuat pemanggilan model berbayar aktif tanpa persetujuan.

## 9. Akses, privasi dan moderasi

- Room publik: dapat dilihat tanpa login hanya pada konten yang memang ditetapkan publik; aksi menulis/RSVP/mengikuti memerlukan autentikasi.
- Room privat/invite-only: tidak boleh mengungkap nama anggota, agenda, konten, atau keberadaan meja privat kepada pengunjung yang tidak berwenang.
- Hak akses diperiksa di server pada setiap operasi, bukan hanya menyembunyikan tombol UI.
- Keanggotaan room dan keanggotaan komunitas/meja dipisahkan.
- Undangan mempunyai expiry, revoke, batas penggunaan jika diperlukan, dan token acak berentropi tinggi yang disimpan sebagai hash.
- Meeting URL, unggahan, dan media tidak otomatis publik.
- Sediakan report/moderation, audit log, consent notice, kebijakan privasi, retensi dan penghapusan data.
- Uji akses allow/deny antar-tenant; jangan mengandalkan UUID yang sulit ditebak sebagai kontrol keamanan.
- Jangan menyimpan data pribadi berlebihan. Evaluasi kepatuhan UU PDP Indonesia sebelum pilot publik.

## 10. Arsitektur awal

- Web: Next.js + TypeScript, responsive mobile-first, PWA-ready.
- Data: Neon PostgreSQL; skema aplikasi hanya setelah migrasi diuji pada branch development.
- Auth: Neon Auth/Managed Better Auth bila sesuai konfigurasi. Petakan subject/ID dari sesi auth ke profiles secara eksplisit; jangan menebak format ID.
- Server: server actions/API route dengan validasi input dan pemeriksaan role/membership per request.
- UI scene: komponen scene terpisah dari data room/table/session; 2D terlebih dahulu.
- CI: lint, typecheck, unit/security tests dan build di GitHub Actions.
- Hosting: pilih opsi free tier setelah memeriksa kompatibilitas dan kuota; GitHub sendiri bukan host untuk aplikasi dinamis. Tidak ada klaim live sebelum deployment diuji.

## 11. Entitas data yang dibutuhkan

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

## 12. Tahapan dan kriteria selesai

1. **Product/UI prototype:** scene 2D dan navigasi dapat dicoba dengan data contoh yang jelas berlabel demo.
2. **Database/auth:** mapping identitas diverifikasi; migration diuji pada development branch; tidak ada perubahan production.
3. **Community/room:** operasi CRUD terotorisasi dan tes lintas tenant lulus.
4. **Agenda/library/invitation:** expiry, revoke, visibilitas, RSVP dan tautan diuji.
5. **Expo/public-private:** uji pengunjung publik dan anggota privat.
6. **Release candidate:** lint/typecheck/build, tes keamanan, aksesibilitas, responsif, backup/restore, kebijakan privasi, dan observabilitas.
7. **Deployment:** hanya dinyatakan live setelah URL deployment nyata dan endpoint health diuji.

## 13. Target pilot

Target awal untuk diuji bersama 5–10 komunitas pilot, bukan klaim pengguna aktif. Ukur keberhasilan dari waktu masuk room, keberhasilan menerima undangan, jumlah RSVP, kunjungan booth, stabilitas mobile, dan laporan pelanggaran. Angka target dapat direvisi berdasarkan hasil pilot.

## 14. Di luar cakupan MVP

- Membaca atau mengelola isi grup WhatsApp biasa secara otomatis.
- Menjamin jumlah peserta video tanpa evaluasi layanan.\n- Karaoke streaming/audio real-time, katalog lagu berlisensi, dan sinkronisasi lirik pada MVP awal.
- Dunia 3D penuh atau audio spasial.
- Marketplace pembayaran, dompet, dan transfer dana.
- Generasi AI berbayar aktif secara default.

Semua fitur ini memerlukan keputusan, biaya, izin, serta pengujian tambahan.


## 15. Podcast & Audio Lounge — fitur inti lintas komunitas

Podcast menjadi kanal konten dan acara tersendiri, bukan hanya tautan keluar. Produk harus membedakan kemampuan yang sudah benar-benar diimplementasikan dari konsep/demo.

### Pengalaman pengguna
- **Podcast Studio:** buat serial, episode, deskripsi, kategori, cover, host, tamu, bahasa, durasi, dan status publik/draf.
- **Live Audio Lounge:** sesi audio terjadwal dengan host, co-host, pembicara, pendengar, permintaan naik panggung, mute, dan moderator. Untuk MVP awal, mulai dengan tautan audio/meeting eksternal dan agenda; live audio native memerlukan pemilihan provider dan pengujian biaya.
- **Episode & arsip:** pemutar audio yang sah di-host atau disematkan, transkrip jika tersedia, bab/timestamp, catatan acara, sumber dan tautan terkait.
- **Podcast lintas komunitas:** host dapat mengundang komunitas lain sebagai co-host/mitra dan mengundang individu yang bersedia berpartisipasi. Undangan mempunyai penerima, peran, masa berlaku, status persetujuan, dan dapat dicabut.
- **Cross-community guest pass:** undangan dapat memberi akses hanya ke sesi/episode tertentu; tidak otomatis menjadikan tamu anggota komunitas atau membuka direktori, meja, dokumen, atau riwayat privat.
- **Acara interaktif:** pertanyaan audiens, polling, daftar pembicara, Q&A yang dimoderasi, reaksi, RSVP, pengingat yang dapat dikontrol pengguna, dan formulir usulan topik.
- **Discover & follow:** ikuti podcast/host/kategori, simpan episode untuk nanti, daftar putar, riwayat tontonan/dengaran yang dapat dihapus, dan rekomendasi berdasarkan minat yang dipilih.
- **Podcast komunitas:** orang tua-sekolah, cerita warga, UMKM, alumni, kelas singkat, hobi, olahraga, budaya, literasi digital, dan diskusi antar-komunitas. Untuk komunitas sensitif, sediakan opsi tidak tercantum/tidak dapat dicari.
- **Distribusi:** tautan episode dan kartu undangan yang siap dibagikan ke WhatsApp; RSS/feed atau ekspor hanya setelah kebijakan privasi, hak konten, dan kebutuhan teknis ditetapkan.
- **Hak cipta & keselamatan:** hanya unggah audio yang dimiliki/dilisensikan; persetujuan tamu dan pemberitahuan sebelum rekaman/transkripsi; laporan, takedown, dan aturan retensi.

### Fase pelaksanaan podcast
- **P0 (hemat biaya):** katalog podcast/episode berbasis tautan yang diizinkan, jadwal acara, RSVP, undangan co-host/tamu, catatan acara, dan daftar putar sederhana.
- **P1:** unggah/pemutaran audio sendiri dengan penyimpanan yang sesuai, progress playback, bookmark, metadata, moderasi, dan penghapusan.
- **P2:** live audio native, rekaman, transkripsi/ringkasan berbantuan AI, dan distribusi RSS setelah evaluasi provider, biaya, consent, keamanan, dan lisensi.
- Jangan menyebut live audio, upload, transkripsi, atau playback native sebagai fitur aktif sebelum kode, layanan, tes, dan batas kuota benar-benar tersedia.

## 16. Alasan pengguna kembali — keterlibatan yang sehat

Bangun kebiasaan melalui nilai yang konsisten, bukan manipulasi:
- **Agenda personal:** satu tampilan agenda dari komunitas yang diikuti, dengan zona waktu, RSVP, dan pengingat yang opt-in.
- **Ringkasan mingguan:** acara, keputusan, materi baru, dan tugas yang relevan; setiap sumber mengikuti izin komunitas.
- **Belajar bersama:** tantangan mingguan opsional, kelas singkat, sesi tanya jawab, klub baca/dengar, dan arsip materi.
- **Kontribusi dan pengakuan:** ucapan terima kasih, lencana berbasis kontribusi yang nyata, profil keahlian sukarela; tanpa leaderboard yang mempermalukan atau mendorong spam.
- **Komunitas lintas minat:** rekomendasi acara/booth/podcast publik yang relevan, dengan alasan rekomendasi dan kontrol topik.
- **Proyek nyata:** papan tugas, relawan, kolaborasi karya, mentoring, katalog UMKM, dan tindak lanjut setelah acara.
- **Memory & continuity:** catatan keputusan, album/galeri yang disetujui, daftar sumber, dan arsip episode agar manfaat komunitas tidak hilang di arus chat.
- **Kontrol perhatian:** ringkasan sebagai default yang masuk akal, pengaturan frekuensi notifikasi, mode senyap, jam tenang, jeda akun, berhenti mengikuti, ekspor/hapus data, dan tidak ada streak berisiko atau notifikasi rasa bersalah.
- **Transparansi:** jelaskan mengapa konten direkomendasikan; jangan menjual data pribadi atau menggunakan data sensitif untuk engagement.

## 17. Fitur tambahan yang membuat RUANG KITA berguna

1. **Community Calendar:** agenda lintas ruang yang disatukan hanya dari komunitas yang dipilih pengguna.
2. **Event & workshop kit:** RSVP, kapasitas, daftar tunggu, daftar tugas panitia, sertifikat kehadiran bila relevan, dan ekspor kalender.
3. **Knowledge Commons:** FAQ, notulen, dokumen, materi belajar, dan pencarian yang menghormati izin tiap ruang.
4. **Community Help Exchange:** anggota menawarkan/ meminta bantuan, barter keahlian, mentoring, atau relawan; data kontak dibuka dengan persetujuan.
5. **Local discovery & Expo:** pameran lintas komunitas, karya, jasa, UMKM, dan acara publik tanpa mengungkap data anggota privat.
6. **Polls & deliberation:** polling, usulan, komentar terstruktur, dan hasil musyawarah dengan identitas/kerahasiaan yang jelas.
7. **Family/School safeguards:** ruang per kelas, akses wali/guru terpisah, pengumuman terverifikasi, dan minimisasi data anak.
8. **Community wellbeing & safety:** laporan, blokir, mute, moderator, banding, dan catatan tindakan yang proporsional.
9. **Import helper:** panduan menyalin tautan, dokumen, atau pengumuman yang dipilih secara manual; jangan mengasumsikan akses otomatis ke seluruh isi grup WhatsApp.
10. **PWA-friendly experience:** navigasi mobile, simpan agenda/tautan yang diizinkan untuk akses cepat, dan penanganan koneksi lambat; offline penuh tidak dijanjikan tanpa implementasi.
11. **Creator/knowledge monetization (fase lanjut):** tiket atau keanggotaan berbayar hanya setelah legal, pajak, payment provider, refund, dan biaya operasional dievaluasi; bukan fitur Rp0 yang diasumsikan aktif.
12. **Community analytics:** statistik agregat untuk admin, dengan ambang privasi dan tanpa pengawasan individu yang tidak perlu.

## 18. Model data tambahan untuk podcast dan undangan lintas komunitas

Entitas yang perlu dirancang dan direview sebelum migrasi:
- podcast_shows, podcast_episodes, podcast_hosts;
- audio_sessions, audio_session_roles, speaker_requests;
- cross_community_invitations (scope, inviter, invitee/community, assigned role, expiry, revoked_at, accepted_at);
- episode_bookmarks, listening_progress, follows, playlists;
- episode_transcripts (opsional, consent dan retensi), episode_reports, recording_consents;
- notification_preferences, quiet_hours, user_topic_preferences;
- activity_digest_preferences dan recommendation_feedback.

Semua data harus punya pemilik/tenant yang jelas, constraint integritas, validasi server-side, kebijakan retensi, dan tes akses. Jangan menggabungkan tabel lintas komunitas tanpa pemeriksaan izin. Untuk media, gunakan URL bertanda tangan/akses terbatas jika diperlukan; jangan menganggap file privat sebagai publik.

## 19. Prinsip keterlibatan bertanggung jawab dan metrik

Keberhasilan bukan sekadar waktu layar. Ukur:
- acara yang benar-benar dihadiri dan RSVP yang berhasil;
- episode yang diselesaikan secara sukarela, bookmark, dan partisipasi Q&A;
- kontribusi bermanfaat, tugas yang selesai, bantuan yang berhasil dipertemukan;
- keberhasilan undangan lintas komunitas dan tingkat penerimaan yang disetujui;
- retensi komunitas dengan survei manfaat dan kepuasan;
- laporan spam/pelecehan, tingkat penyelesaian laporan, opt-out notifikasi, dan kontrol privasi.

Jangan mengoptimalkan endless scroll, autoplay tanpa kontrol, streak yang menimbulkan rasa bersalah, dark patterns, atau notifikasi yang memanfaatkan kecemasan sosial.
