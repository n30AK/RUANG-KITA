# RUANG KITA — MASTER BUILD SPECIFICATION v3.0

> Versi terpadu: spesifikasi v2.0 ditambah interoperabilitas engine, simulasi dunia 3D, diagnosis rendering, dan multi-agent AI yang dibatasi izin.

## Expandable 3D Social Universe | Zero-Budget First | AI-Assisted Development

## 1. PERAN DAN MANDAT

Bertindak sebagai tim engineering multidisiplin
yang terdiri dari:

·        
Principal Software Architect

·        
Senior Full-Stack Engineer

·        
3D Web Developer

·        
Multiplayer/Realtime Engineer

·        
Database Engineer

·        
AI Multi-Agent Architect

·        
Security Engineer

·        
QA and Automation Engineer

·        
DevOps and Cost Optimization Engineer

·        
Product Designer

·        
Accessibility and Performance Engineer

Bangun RUANG KITA sebagai platform sosial virtual
berbasis browser, modular, aman, ringan, dan dapat dikembangkan secara
bertahap.

Kerjakan secara mandiri melalui tahapan yang jelas.
Audit kondisi yang ada sebelum membuat perubahan. Jangan meminta persetujuan
untuk pekerjaan rutin yang tidak berisiko, tetapi jangan melakukan tindakan
destruktif, mengaktifkan layanan berbayar, menghapus data, atau memublikasikan
perubahan berisiko tanpa otorisasi yang sesuai.

Jangan mengklaim pekerjaan selesai, tes lulus,
database tersambung, atau aplikasi online sebelum hasilnya benar-benar
diverifikasi.

### Mandat eksekusi tambahan
- Audit source, runtime, deployment, dependensi, dan akses sebelum membuat kesimpulan.
- Bedakan fitur yang ditulis, fitur yang berjalan, dan fitur yang benar-benar diuji.
- Jangan menganggap keberadaan canvas sebagai bukti bahwa frame 3D terlihat.
- Utamakan perbaikan akar masalah, perubahan kecil yang dapat ditinjau, tes regresi, dan rollback.
- Jangan mengklaim simulasi realistis, AI otonom, multiplayer, atau integrasi engine penuh jika bukti yang ada hanya berupa heuristik lokal, adapter aset, atau stub.

## 2. VISI PRODUK

RUANG KITA bukan sekadar aplikasi tiga ruangan.
RUANG KITA adalah semesta sosial virtual yang memungkinkan orang dan komunitas
berkumpul melalui dunia 3D yang dapat dijelajahi, dibuat, dikustomisasi, dan
dihubungkan.

Pengguna dapat:

·        
Memasuki dunia virtual melalui browser.

·        
Menggunakan avatar 3D manusia yang dapat
dikustomisasi.

·        
Membuat komunitas privat, berbasis undangan,
atau publik.

·        
Mengobrol, mengikuti acara, dan bertemu komunitas
lain dengan persetujuan.

·        
Membuat dunia baru melalui template atau AI
World Builder.

·        
Memiliki pendamping AI personal.

·        
Mengelola galeri, kegiatan, kelas, pameran, dan
acara komunitas.

·        
Mengembangkan dan kelak menawarkan aset atau
desain dunia jika fitur marketplace sudah layak.

Prinsip utama:

1.     
Expandable by Design.

2.     
Autonomous but Governed.

3.     
Privacy and Consent by Default.

4.     
Zero-Budget First.

5.     
Modular, Testable, and Observable.

6.     
Accessible Across Devices.

7.     
Real Functionality over Mock Features.

##  

## 3. KENDALA BIAYA

Anggaran kas awal: Rp0.

Prioritaskan:

·        
GitHub untuk version control dan workflow.

·        
Neon PostgreSQL untuk penyimpanan persisten jika
tersedia pada kuota gratis.

·        
Cloudflare Pages atau hosting gratis yang
sesuai.

·        
Three.js dan React Three Fiber untuk 3D.

·        
TypeScript, React, dan Vite.

·        
Aset 3D open-source atau gratis dengan lisensi
yang diverifikasi.

·        
Web APIs dan algoritma lokal untuk kemampuan AI
awal.

·        
Layanan realtime gratis atau implementasi server
yang sesuai dengan kuota aktual.

Aturan:

·        
Jangan mengaktifkan billing berbayar.

·        
Jangan menambahkan API key berbayar sebagai
dependensi wajib.

·        
Jangan menganggap kuota gratis tidak terbatas.

·        
Verifikasi kuota, batasan, dan persyaratan
layanan saat implementasi.

·        
Buat estimasi penggunaan resource dan mekanisme
peringatan kuota.

·        
Hindari layanan berbayar tersembunyi dalam
dependensi.

·        
Jika layanan gratis tidak tersedia,
dokumentasikan alternatifnya dan pilih implementasi yang tetap dapat diuji.

Rp0 adalah target awal untuk prototipe, bukan
jaminan biaya nol saat skala pengguna meningkat.

##  

##  

## 4. TEKNOLOGI DAN ARSITEKTUR

Gunakan TypeScript sebagai bahasa utama.

Frontend:

·        
React

·        
Vite

·        
Three.js

·        
React Three Fiber bila sesuai

·        
Sistem UI responsif

·        
PWA sebagai peningkatan opsional setelah fungsi
inti stabil

Backend:

·        
Pilih runtime server atau serverless yang
kompatibel dengan hosting dan kebutuhan realtime.

·        
Pisahkan logika bisnis dari UI.

·        
Terapkan validasi input dan otorisasi pada
server.

·        
Jangan menaruh kredensial database atau secret
dalam frontend.

Database:

·        
Neon PostgreSQL untuk data persisten.

·        
Gunakan migration versioned.

·        
Gunakan transaksi, indeks, dan constraint yang
relevan.

·        
Terapkan isolasi data antar-komunitas.

·        
Siapkan strategi backup, ekspor, retensi, dan
pemulihan yang realistis.





Realtime:

·        
Pisahkan data persisten dari data sementara.

·        
Chat dan kehadiran anggota menggunakan mekanisme
realtime yang sesuai.

·        
Posisi avatar dikirim dengan interval atau
mekanisme interpolasi yang efisien, bukan disimpan ke database pada setiap
frame.

·        
Evaluasi WebSocket, WebRTC, atau layanan
realtime berdasarkan kebutuhan nyata.

·        
Jangan mengklaim multiplayer berfungsi jika
hanya satu browser yang telah diuji.

## 5. WORLD ENGINE — ARSITEKTUR DUNIA DINAMIS

Bangun satu World Engine yang memuat dunia dari
konfigurasi, bukan membuat aplikasi terpisah untuk setiap scene.

Komponen wajib:

·        
World Registry

·        
Scene Registry

·        
Scene Template Engine

·        
Asset Catalog

·        
World Configuration Schema

·        
World Loader

·        
Portal and Navigation System

·        
Room Capacity Management

·        
Environment and Lighting Configuration

·        
World Versioning

·        
Validation Pipeline

·        
Performance Budget

·        
World Publishing Workflow



Setiap dunia harus memiliki World Passport dengan:

·        
ID unik dan slug.

·        
Nama, deskripsi, kategori, pemilik, dan versi.

·        
Referensi aset dan template.

·        
Tata letak dan konfigurasi lingkungan.

·        
Aturan akses dan kapasitas.

·        
Fitur yang diizinkan.

·        
Status validasi dan publikasi.

·        
Catatan perubahan dan audit.

·        
Kebijakan privasi dan moderasi.

·        
Kebutuhan resource dan batas performa.

Gunakan schema validation yang ketat. Jangan
menjalankan kode arbitrer dari konfigurasi dunia.

### Tiga dunia awal

1.     
ANGKRINGAN KITA

o    Nuansa
angkringan Indonesia.

o    Tempat
duduk dan titik berkumpul.

o    Navigasi
sederhana.

o    Interaksi
sosial dan chat.

2.     
CAFE KITA

o    Kafe
dengan meja, kursi, dan area diskusi.

o    Ruang
rapat dan kegiatan komunitas.

3.     
PANTAI KITA

o    Lingkungan
pantai dengan pencahayaan yang sesuai.

o    Area
berkumpul dan kegiatan publik.

Ketiganya harus menggunakan mesin dan sistem
komponen yang sama, tetapi konfigurasi dan aset visual berbeda.

###  

### Scene tambahan

Pengguna dan pengelola nantinya dapat menambahkan:

·        
Pendopo budaya.

·        
Galeri seni.

·        
Kampus virtual.

·        
Perpustakaan.

·        
Taman kota.

·        
Pameran produk dan UMKM.

·        
Auditorium.

·        
Ruang kerja.

·        
Dunia permainan sosial.

·        
Dunia tematik hasil kreasi pengguna.

Scene berbasis template harus dapat dibuat tanpa
mengubah kode inti. Dunia yang membutuhkan aset khusus atau mekanisme baru
boleh membutuhkan pekerjaan tambahan.

## 5A. INTEROPERABILITAS THREE.JS, BABYLON.JS, DAN GODOT

### Keputusan arsitektur
- **Three.js** tetap menjadi renderer utama RUANG KITA selama arsitektur dan benchmark saat ini mendukungnya.
- **Babylon.js** dapat dipakai untuk authoring, tooling, validasi aset, atau eksperimen terisolasi. Jangan memasukkan runtime penuh ke produksi tanpa kebutuhan dan benchmark yang terukur.
- **Godot** dapat dipakai untuk authoring/prototyping atau modul terpisah bila diperlukan. Runtime Godot tidak otomatis menjadi objek native dalam scene Three.js.
- **glTF 2.0/GLB** menjadi format pertukaran utama untuk mesh, rig, animasi, dan material yang kompatibel. Tidak semua shader, physics, node khusus, atau extension engine dapat berpindah sempurna.
- Catat keputusan dalam ADR dan verifikasi lisensi serta atribusi setiap aset.

### Kontrak adapter aset
1. Sediakan API konsisten untuk memuat, memosisikan, melepas, dan membersihkan aset.
2. Gunakan manifest berisi ID, format, path/URL, ukuran, lisensi, atribusi, versi, dan status validasi.
3. Pin versi loader dan engine; pastikan import map dan resolusi modul konsisten.
4. Tangani progress, timeout, file rusak, CORS, format tak didukung, dan kegagalan jaringan dengan status UI yang jelas.
5. Bersihkan geometry, material, texture, animation mixer, listener, dan resource GPU ketika scene dilepas.
6. Uji satu aset GLB nyata dan satu jalur kegagalan. Loader terdaftar bukan bukti integrasi berhasil.
7. Jangan menyebut adapter glTF sebagai penggabungan runtime penuh ketiga engine.

### Kriteria penerimaan
Model GLB dapat dimuat, terlihat, diposisikan, dianimasikan jika memiliki clip yang didukung, lalu dilepas tanpa error; kegagalan dapat dipulihkan; versi dependensi konsisten; dan ukuran bundle/waktu muat/FPS dibandingkan sebelum runtime tambahan dipertimbangkan.

## 6. AI WORLD BUILDER

Buat jalur pembuatan dunia berbasis AI dengan
arsitektur bertahap.

Alur:

1.     
Pengguna memasukkan deskripsi dunia.

2.     
Sistem mengidentifikasi kategori, ukuran, suasana, fitur,
dan kebutuhan aset.

3.     
Generator membuat konfigurasi terstruktur berdasarkan
schema.

4.     
Sistem memilih template dan aset yang telah disetujui.

5.     
Sistem memvalidasi referensi aset, akses, kapasitas,
dan performa.

6.     
Dunia dijalankan dalam preview atau sandbox.

7.     
Tes otomatis memeriksa fungsi dasar.

8.     
Dunia dipublikasikan hanya setelah lolos kebijakan dan
validasi.

9.     
Jika gagal, sistem memberikan alasan dan opsi
perbaikan.

Pada MVP, gunakan generator berbasis aturan dan
template jika tidak tersedia model AI gratis yang dapat diandalkan.

AI tidak boleh:

·        
Menghasilkan kode tak terbatas lalu
menjalankannya di produksi.

·        
Mengakses database tanpa izin yang dibatasi.

·        
Mengunggah aset berhak cipta tanpa dasar
penggunaan.

·        
Mempublikasikan dunia berisiko tanpa
pemeriksaan.

·        
Menghabiskan resource tanpa batas.

·        
Mengubah aturan keamanan atau akses.

## 7. AVATAR ENGINE

Bangun sistem avatar modular yang dapat
ditingkatkan tanpa mengganti arsitektur dunia.

MVP:

·        
Avatar manusia 3D ringan.

·        
Model dan rig yang kompatibel.

·        
Pilihan rambut, wajah, pakaian, warna, dan
aksesori yang tersedia.

·        
Animasi idle, berjalan, berlari bila diperlukan,
duduk, dan gestur sederhana.

·        
Penyimpanan konfigurasi avatar.

·        
Sinkronisasi penampilan dengan pengguna lain.

·        
Fallback untuk perangkat berperforma rendah.

Tahapan selanjutnya:

·        
Detail wajah dan tubuh lebih realistis.

·        
Ekspresi wajah.

·        
Animasi tangan dan tubuh lebih halus.

·        
Sinkronisasi bibir dengan suara.

·        
Avatar berbasis foto secara opsional dengan
persetujuan eksplisit.

·        
Digital human yang lebih realistis bila performa
dan sumber daya memungkinkan.

Jangan menjanjikan avatar fotorealistis pada MVP
jika model, aset, dan pipeline yang tersedia belum mendukungnya.

Perhatikan lisensi model, hak atas wajah, privasi,
moderasi, dan larangan penyalahgunaan identitas.

## 7A. WORLD SIMULATION — COLLISION, FISIKA, DAN GERAK ALAMI

### Sistem inti
- Definisikan collision layer/mask untuk pemain, NPC, kendaraan, bangunan, furnitur, props, dan trigger.
- Gunakan collider yang sesuai dengan bentuk dan kebutuhan; pisahkan trigger interaksi dari collider penghalang.
- Pisahkan fixed-step physics dari render loop bila diperlukan, dan tangani delta time besar setelah tab/browser tertunda.
- Gunakan character controller, ground check, gravitasi, batas kemiringan, dan resolusi penetrasi yang konsisten.
- Kendaraan memerlukan footprint/radius, kecepatan, pengereman, jarak aman, dan pemeriksaan jalur.
- NPC membutuhkan waypoint/navmesh sesuai skala, obstacle avoidance, personal space, dan strategi saat jalur buntu.
- State gerak harus eksplisit: idle, berjalan, berbicara, duduk, bekerja, mengemudi, menghindar, menunggu, dan recovery.
- Animasi harus mengikuti state dan kecepatan fisik, bukan berjalan di tempat ketika collider menahan gerak.

### Aturan anti-tabrakan
1. Untuk objek cepat, pertimbangkan swept collision/continuous collision detection atau substeps; pemeriksaan posisi akhir saja bisa melewatkan tabrakan.
2. Konflik harus punya kebijakan mengalah/menunggu dengan batas waktu dan jalur alternatif; jangan membuat kendaraan berhenti permanen.
3. Validasi tujuan NPC terhadap navmesh/collider sebelum bergerak.
4. Beri feedback ketika pemain terhalang; jangan mengunci avatar tanpa penjelasan.
5. Uji regresi gerak pemain, NPC, kendaraan, interior, furnitur, pintu, duduk/berdiri, dan masuk/keluar kendaraan.
6. Catat penetrasi, jitter, deadlock, waktu macet, dan FPS. Jangan menyebut dunia “realistis” secara absolut; laporkan skenario yang benar-benar diuji.

### Skenario uji minimum
Avatar vs dinding/furnitur/NPC; kendaraan vs kendaraan/pejalan kaki/dinding; dua NPC berpapasan; jalur buntu; frame drop; perpindahan scene; serta simulasi berulang 5–10 menit untuk mendeteksi macet dan kebocoran resource.

## 8. COMMUNITY CORE

Setiap komunitas memiliki:

·        
ID dan profil.

·        
Pemilik dan moderator.

·        
Anggota dan peran.

·        
Ruang privat atau publik.

·        
Aturan dan deskripsi.

·        
Undangan.

·        
Agenda acara.

·        
Pengumuman.

·        
Galeri atau arsip.

·        
Pengaturan penemuan sosial.

·        
Kebijakan retensi dan penghapusan data.

Jenis akses:

·        
Private.

·        
Invite-only.

·        
Community-only.

·        
Public.



Dukung portal antardunia dan acara gabungan dengan
pemeriksaan izin yang konsisten.

Jangan membuka data anggota komunitas privat kepada
komunitas lain hanya karena keduanya berbagi sebuah ruang publik.

## 9. INTEGRASI WHATSAPP DAN FACEBOOK

Tahap awal:

·        
Pendaftaran komunitas secara manual.

·        
Undangan berupa tautan RUANG KITA.

·        
Tautan undangan dapat dibagikan melalui
WhatsApp, Facebook, dan media lain.

·        
Pengguna memilih sendiri apakah ingin bergabung
dan informasi apa yang ditampilkan.

Tahap berikutnya:

·        
Evaluasi API resmi, batas akses, biaya, dan
persyaratan platform.

·        
Implementasikan hanya integrasi yang didukung
dan diotorisasi.

Dilarang:

·        
Mengambil pesan privat melalui scraping tanpa
izin.

·        
Mencuri cookie, token, atau sesi.

·        
Menyimpan kredensial platform secara tidak aman.

·        
Mengklaim sinkronisasi otomatis jika API tidak
mendukungnya.

## 10. MULTI-AGENT AI

Buat modul agen yang memiliki tanggung jawab
terpisah.

### Agent 1 — WORLD ARCHITECT

Menghasilkan rancangan dunia, konfigurasi, dan
rekomendasi aset.

### Agent 2 — COMMUNITY GUIDE

Membantu onboarding, navigasi, aturan, dan penemuan
fitur.

### Agent 3 — SOCIAL MATCHMAKER

Merekomendasikan komunitas, acara, atau perkenalan
dengan persetujuan pengguna.

### Agent 4 — SAFETY MODERATOR

Membantu mendeteksi spam, konten berisiko, dan
laporan penyalahgunaan.

### Agent 5 — PLATFORM ENGINEER

Menganalisis error, menjalankan tes yang diizinkan,
dan mengusulkan perbaikan.

### Agent 6 — PRIVACY GUARD

Memeriksa izin, minimisasi data, akses, dan
kebijakan privasi.

### Agent 7 — COST OPTIMIZER

Memantau penggunaan resource, kuota, dan risiko
biaya.

### Agent 8 — CREATOR COMPANION

Membantu kreator mengembangkan dunia, profil, dan
kegiatan komunitas.

### Agent 9 — KNOWLEDGE CURATOR

Menyaring pengetahuan umum yang layak dibagikan
antaragen dengan sumber, batas akses, dan evaluasi kualitas.

### Agent 10 — QA ORCHESTRATOR

Mengkoordinasikan pengujian, mengelompokkan
kegagalan, dan menyusun laporan.

Implementasi MVP:

·        
Gunakan modul TypeScript deterministik.

·        
Definisikan input, output, izin, dan tes setiap
agen.

·        
Gunakan model bahasa hanya sebagai kemampuan
opsional.

·        
Jangan mensyaratkan banyak model AI berbayar.

·        
Agen tidak boleh mengubah diri atau memperluas
izin sendiri.

AI personal dapat memiliki konfigurasi dan memori
tersendiri. Pengetahuan privat pemilik tidak boleh masuk ke knowledge base
bersama secara otomatis.

### 10A. WORLD INTELLIGENCE — ANALISIS, PREDIKSI, DAN PERBAIKAN TERKENDALI

Gunakan agen dengan input/output, izin, timeout, anggaran resource, dan tes yang jelas. MVP boleh deterministik; jangan menyebut aturan lokal sebagai reasoning LLM.

**Peran agen/sistem:**
- **World Observer:** mengumpulkan metrik minimal tentang posisi, state, collision, jalur terhalang, FPS, dan kegagalan aset.
- **Anomaly Detector:** mendeteksi penetrasi, gerak tak mungkin, NPC macet, deadlock kendaraan, aset hilang, lonjakan frame time, dan transisi state tidak sah.
- **World Predictor:** memperkirakan konflik lintasan jangka pendek berdasarkan kecepatan, arah, collider, dan jarak aman.
- **Behavior Planner:** memilih pengereman, mengalah, menunggu, waypoint alternatif, pembatalan interaksi, atau recovery yang aman.
- **Scene Builder:** membuat konfigurasi tervalidasi dari schema dan aset yang diizinkan; tidak menjalankan kode arbitrer.
- **Simulation QA:** membuat/menjalankan skenario tes terbatas dan membandingkan hasil dengan baseline.
- **Repair Orchestrator:** menyiapkan patch/diff, menjalankan lint/test/build di sandbox/branch, dan mendokumentasikan rollback.
- **Safety & Privacy:** memeriksa izin, data yang dikumpulkan, dan tindakan berisiko.
- **Resource Governor:** membatasi jumlah agen, frekuensi evaluasi, waktu CPU, memori, ukuran aset, dan panggilan model.
- **Audit Reporter:** mencatat sinyal, severity, keputusan, tindakan, hasil tes, dan status akhir.

**Siklus:** Observe → Detect → Assess → Predict → Plan → Validate → Apply in sandbox → Test → Approve/Rollback → Audit.

- Collision resolution dan keputusan real-time harus tetap lokal dan cepat; jangan menunggu model bahasa setiap frame.
- Runtime boleh menjalankan tindakan reversibel yang aman, seperti pengereman, penghindaran, waypoint alternatif, fallback aset, atau recovery ke titik tervalidasi.
- Patch kode tidak boleh langsung dijalankan di produksi. Wajib melewati diff, sandbox, lint, type-check, tes, pemeriksaan keamanan, dan quality gate deployment.
- Terapkan retry budget, backoff, circuit breaker, dan eskalasi jika perbaikan gagal.
- Agen tidak boleh memperluas izin sendiri, mengubah kebijakan keamanan, membaca secret, menghapus audit, atau menyetujui patch-nya sendiri.
- Minimalkan telemetry dan jangan mengirim chat privat/identitas ke knowledge base bersama secara otomatis.

**Prioritas:** P0 keamanan/data—blokir dan eskalasi; P1 tabrakan—perlambat/hentikan dan cari jalur aman; P2 scene/aset gagal—fallback yang jelas; P3 performa—turunkan LOD/efek secara terkendali; P4 anomali visual ringan—catat untuk perbaikan.

## 11. COLLECTIVE INTELLIGENCE

Bangun pertukaran pengetahuan antarkomponen AI
secara terkontrol.

Aturan:

·        
Pisahkan data privat, data komunitas, dan
pengetahuan publik.

·        
Gunakan persetujuan eksplisit untuk kontribusi
data.

·        
Simpan sumber, waktu, dan asal informasi yang
dibagikan.

·        
Sediakan mekanisme koreksi, penghapusan, dan
penandaan informasi usang.

·        
Cegah satu agen mengekspor rahasia milik
pengguna lain.

·        
Evaluasi kualitas sebelum pengetahuan dipakai
agen lain.

Pertukaran pengetahuan tidak berarti kemampuan
model otomatis berlipat ganda. Ukur manfaatnya melalui evaluasi yang dapat
diulang.

## 12. EVENT UNIVERSE

Rancang arsitektur agar kelak mendukung:

·        
Kalender acara.

·        
Registrasi.

·        
Kapasitas peserta.

·        
Jadwal dan zona waktu.

·        
Pengelola acara.

·        
Panggung, galeri, dan ruang diskusi.

·        
Pengumuman acara.

·        
Sistem tiket opsional pada fase bisnis.

·        
Rekap dan statistik acara.

MVP cukup menyiapkan fondasi dan antarmuka yang
benar-benar terimplementasi sesuai fase.

## 13. WORLD MARKETPLACE

Siapkan arsitektur masa depan untuk:

·        
Template dunia.

·        
Aset dekorasi.

·        
Pakaian avatar.

·        
Paket lingkungan.

·        
Jasa pembuatan dunia.

·        
Lisensi dan atribusi kreator.

·        
Versi, rating, dan laporan pelanggaran.

Marketplace berbayar belum perlu diaktifkan pada
MVP.

Jangan membuat fitur pembayaran palsu. Pembayaran
hanya ditambahkan setelah penyedia, biaya, kewajiban hukum, dan proses refund
diperiksa.

## 14. DATABASE NEON

Buat migration terstruktur untuk entitas yang
diperlukan, sekurang-kurangnya:

·        
users

·        
user_profiles

·        
avatar_configs

·        
communities

·        
community_members

·        
worlds

·        
world_versions

·        
scenes

·        
scene_assets

·        
rooms

·        
room_members

·        
invitations

·        
events

·        
event_registrations

·        
connections

·        
consent_records

·        
chat_messages

·        
moderation_reports

·        
user_blocks

·        
ai_agent_configs

·        
ai_agent_runs

·        
knowledge_items

·        
audit_logs

Sesuaikan tabel berdasarkan kebutuhan implementasi
dan hindari overengineering.

Persyaratan:

·        
Foreign key dan constraint yang sesuai.

·        
Indeks untuk pola query penting.

·        
Migration yang dapat diaudit.

·        
Pagination.

·        
Retensi pesan dan data yang dapat dikonfigurasi.

·        
Penghapusan akun dan ekspor data sesuai
kebutuhan.

·        
Pemisahan tenant atau komunitas.

·        
Secret hanya berada pada environment server.

·        
Tidak ada data contoh yang menyamar sebagai data
produksi.

Buat `.env.example` tanpa secret asli. Jika kredensial
Neon belum tersedia, bangun migration dan mode lokal yang dapat diuji, lalu
tandai integrasi produksi sebagai BLOCKED atau NOT TESTED.

## 15. SECURITY DAN PRIVACY

Terapkan:

·        
Authentication sesuai kebutuhan produk.

·        
Authorization server-side.

·        
Validasi dan normalisasi input.

·        
Pencegahan XSS dan injection.

·        
Rate limiting.

·        
Proteksi endpoint sensitif.

·        
Pengelolaan sesi yang aman.

·        
Batas ukuran pesan dan upload.

·        
Pemeriksaan tipe file.

·        
Kebijakan akses per komunitas dan dunia.

·        
Blokir dan pelaporan pengguna.

·        
Audit log tanpa menyimpan secret.

·        
Kebijakan retensi dan penghapusan.

·        Perlindungan terhadap penyalahgunaan undangan.

·        
Pembatasan tool dan izin agen AI.

Jangan menyimpan kata sandi dalam plaintext. Jangan
menaruh service-role key atau kredensial database di browser.

##  

## 16. REALTIME DAN MULTIPLAYER

Rancang sistem agar mendukung:

·        
Kehadiran pengguna.

·        
Avatar dalam satu ruangan.

·        
Sinkronisasi posisi dan rotasi.

·        
Chat.

·        
Perpindahan antarruang.

·        
Penanganan koneksi terputus.

·        
Reconnection.

·        
Validasi pesan dari server.

·        
Batas jumlah pengguna per ruangan.

·        
Interpolasi gerakan untuk tampilan yang lebih
halus.

Gunakan event dan interval yang efisien. Jangan
mengirim posisi setiap frame. Pisahkan presence sementara dari data permanen.

Jika layanan realtime belum tersedia, sediakan mode
lokal yang jelas dan dokumentasikan bahwa multiplayer belum aktif. Jangan
menyebut simulasi lokal sebagai multiplayer produksi.

## 17. ADAPTIVE PERFORMANCE

Tetapkan anggaran performa untuk perangkat sasaran.

Implementasikan secara bertahap:

·        
Level of Detail.

·        
Penggunaan ulang aset dan material.

·        
Pengurangan draw calls.

·        
Texture compression jika didukung pipeline.

·        
Culling objek.

·        
Pemangkasan efek visual pada perangkat rendah.

·        
Pembatasan jumlah avatar yang dirender secara
bersamaan.

·        
Lazy loading scene.

·        
Pengurangan ukuran unduhan awal.

·        
Pemantauan FPS dan penggunaan memori jika
memungkinkan.

Sediakan fallback untuk browser dan perangkat yang
tidak mendukung fitur grafis tertentu.

### 17A. DIAGNOSIS RENDERING DAN GAMBAR YANG TIDAK MUNCUL

Saat dunia, gambar, model, atau tekstur tidak muncul, periksa secara berurutan:
1. Status request HTML, module, import map, CDN, model, tekstur, dan font.
2. `pageerror`, console error, unhandled promise rejection, dan kegagalan network.
3. Ketersediaan WebGL context serta perilaku saat context hilang.
4. Ukuran container/stage, `renderer.setSize`, pixel ratio, camera aspect, clipping plane, CSS visibility, dan layout.
5. Render loop, isi scene, arah kamera, skala, pencahayaan, material, dan posisi objek.
6. Status loading aset, progress, error state, CORS, MIME type, path, dan ekstensi.
7. Browser desktop dan mobile dengan ukuran viewport berbeda.
8. Bukti bahwa frame benar-benar terlihat; canvas DOM saja tidak cukup.
9. Jangan menyamarkan kegagalan runtime dengan placeholder yang tampak seperti dunia interaktif.

Catat status terpisah: HTML, module load, WebGL, asset load, render loop, visible frame, dan browser errors.

## 18. STRUKTUR REPOSITORY

Mulai dari struktur sederhana yang benar-benar
diperlukan. Struktur sasaran dapat berupa:

apps/

web/

api/

packages/

ui/

world-engine/

scene-registry/

avatar-system/

community-core/

room-protocol/

ai-agents/

shared-types/

services/

persistence/

moderation/

assets/

scenes/

avatars/

environments/

tests/

unit/

integration/

e2e/

security/

performance/

docs/

architecture/

database/

security/

operations/

roadmap/

Buat package terpisah hanya jika memberikan batas
tanggung jawab yang jelas. Jangan membuat file kosong atau package yang belum
digunakan hanya untuk memenuhi struktur.

## 19. TESTING DAN QUALITY GATES

Buat tes otomatis untuk:

·        
Validasi konfigurasi dunia.

·        
Pemuatan setiap scene.

·        
Perubahan konfigurasi avatar.

·        
Izin anggota komunitas.

·        
Pembuatan dan kedaluwarsa undangan.

·        
Isolasi data privat.

·        
Validasi chat.

·        
Blokir pengguna.

·        
Penanganan error jaringan.

·        
Migration database.

·        
Input AI World Builder.

·        
Pembatasan tool agen AI.

·        
Keamanan endpoint.

·        
Performa pada perangkat sasaran.

Gunakan unit test, integration test, dan browser
end-to-end test sesuai kebutuhan.

Sebelum deployment:

1.     
Build berhasil.

2.     
Tes wajib lulus.

3.     
Tidak ada secret yang terdeteksi dalam source.

4.     
Migration tervalidasi.

5.     
Variabel environment terdokumentasi.

6.     
Fitur kritis diuji pada browser.

7.     
Error dan keterbatasan dicatat.

8.     
Rollback atau pemulihan didokumentasikan.

Jangan mengklaim keamanan sempurna. Laporkan
pemeriksaan yang telah dilakukan dan risiko yang belum tertutup.

### 19A. QUALITY GATES TAMBAHAN

Sebelum menyatakan modul dunia selesai:
- **Interop:** uji GLB nyata, transform, animasi bila tersedia, cleanup, dan jalur gagal.
- **Rendering:** buktikan frame terlihat dan tidak ada error fatal; jangan berhenti pada pemeriksaan elemen canvas.
- **Collision:** ulangi skenario avatar/NPC/kendaraan termasuk lorong sempit dan objek cepat.
- **Anomaly loop:** injeksikan anomali uji, verifikasi deteksi dan tindakan aman, lalu pastikan tidak ada retry tanpa batas.
- **Performance:** ukur waktu muat, frame time/FPS, ukuran aset, dan kenaikan jumlah objek.
- **Regression:** jalankan ulang skenario terdampak serta skenario inti yang sudah lulus.
- **Evidence:** catat commit/versi, browser/perangkat, hasil tes, dan timestamp jika tersedia.

Tes sintaks statis tidak sama dengan tes runtime; satu browser smoke test tidak memvalidasi seluruh perilaku simulasi.

## 20. SEO DAN PENEMUAN DUNIA

Bangun fondasi SEO yang etis:

·        
Metadata per halaman publik.

·        
URL yang dapat dibagikan.

·        
Sitemap untuk konten publik yang layak diindeks.

·        
Canonical URL.

·        
Structured data yang sesuai dengan konten
sebenarnya.

·        
Preview tautan.

·        
Halaman publik komunitas dengan pengaturan
privasi.

·        
Dokumentasi konten yang dapat diindeks.

Jangan mengindeks ruang privat, profil tersembunyi,
pesan, atau informasi pribadi.

AI dapat membantu membuat deskripsi dunia dan
metadata. Semua konten harus relevan, tidak menyesatkan, dan tidak diproduksi
massal untuk manipulasi peringkat pencarian.

## 21. ROADMAP PEMBANGUNAN

### PHASE 0 — AUDIT DAN FONDASI

·        
Periksa repository dan akses yang tersedia.

·        
Catat branch, commit, struktur, dependensi, dan
konfigurasi.

·        
Pilih arsitektur paling sederhana yang memenuhi
kebutuhan.

·        
Dokumentasikan keputusan teknis.

·        
Buat rencana implementasi dan tes.

### PHASE 1 — BROWSER 3D MVP

·        
Buat aplikasi yang dapat dibuka di browser.

·        
Implementasikan ANGKRINGAN KITA.

·        
Tambahkan avatar 3D, gerakan dasar, dan kamera.

·        
Tambahkan CAFE KITA dan PANTAI KITA.

·        
Gunakan satu World Engine dan konfigurasi scene.

·        
Optimalkan waktu muat.

### PHASE 2 — COMMUNITY DAN MULTIPLAYER

·        
Implementasikan ruangan.

·        
Tambahkan komunitas, anggota, dan undangan.

·        
Tambahkan chat dan presence.

·        
Uji sinkronisasi dari dua browser atau lebih.

·        
Verifikasi batas akses.

###  

### PHASE 3 — DATABASE DAN SECURITY

·        
Integrasikan Neon jika kredensial tersedia.

·        
Terapkan migration.

·        
Uji otorisasi dan isolasi data.

·        
Tambahkan audit log dan retensi.

·        
Periksa keamanan endpoint.

### PHASE 4 — AVATAR DAN WORLD BUILDER

·        
Perluas pilihan avatar.

·        
Tambahkan katalog aset.

·        
Buat generator scene berbasis template.

·        
Terapkan preview, validasi, versi, dan publikasi.

### PHASE 5 — MULTI-AGENT AI

·        
Implementasikan agen berbasis aturan.

·        
Tambahkan tool dan izin per agen.

·        
Bangun evaluasi dan audit.

·        
Integrasikan model opsional hanya jika biaya dan
ketentuannya sesuai.

### PHASE 6 — EVENT DAN INTEGRASI

·        
Tambahkan event dan ruang lintas komunitas.

·        
Evaluasi integrasi resmi platform eksternal.

·        
Tingkatkan moderasi dan kontrol privasi.

### PHASE 7 — MARKETPLACE DAN DIGITAL HUMAN

·        
Evaluasi kebutuhan pengguna nyata.

·        
Tambahkan fitur komersial jika layak.

·        
Tingkatkan avatar dan animasi berdasarkan hasil
uji performa.

·        
Audit biaya sebelum memperluas skala.

Setiap fase memiliki exit criteria. Jangan
menganggap fase selesai hanya karena source code sudah ditulis.

## 22. CI/CD DAN DEPLOYMENT

Gunakan GitHub Actions jika sesuai kuota:

·        
Install dependensi secara reproducible.

·        
Lint.

·        
Type-check.

·        
Unit test.

·        
Build.

·        
Pemeriksaan secret dan dependency.

·        
E2E test bila lingkungan tersedia.

Deploy ke layanan gratis hanya setelah konfigurasi
dan batasannya diverifikasi.

Jangan menampilkan status LIVE tanpa URL yang dapat
diakses dan diuji. Pisahkan status source code, build, deployment, database,
dan realtime.

## 23. STATUS DAN PELAPORAN

Gunakan label:

·        
DONE — telah diimplementasikan dan diverifikasi.

·        
PARTIAL — sebagian berfungsi.

·        
BLOCKED — terhambat dependensi, akses, atau keputusan.

·        
NOT TESTED — belum diuji.

·        
NOT STARTED — belum dikerjakan.

Setiap laporan fase wajib mencantumkan:

·        
Ringkasan pekerjaan.

·        
File penting yang berubah.

·        
Branch dan commit.

·        
Hasil lint, type-check, build, dan tes.

·        
Hasil pemeriksaan keamanan.

·        
Status database dan migration.

·        
Status deployment dan URL jika ada.

·        
Status realtime dan multiplayer.

·        
Penggunaan layanan serta risiko biaya.

·        
Masalah yang tersisa.

·        
Rencana tindakan berikutnya.

Jangan membuat hasil tes atau deployment fiktif.

## 24. DEFINITION OF DONE UNTUK MVP

MVP dinyatakan siap untuk uji coba ketika:

·        
Aplikasi benar-benar dapat dibuka di browser.

·        
Ketiga scene dapat dimuat melalui World Engine
yang sama.

·        
Pengguna dapat bergerak dengan avatar 3D.

·        
Avatar dapat dikustomisasi pada tingkat MVP.

·        
Navigasi antarscene berfungsi.

·        
Ruangan dan komunitas mempunyai aturan akses
yang diuji.

·        
Chat dan multiplayer dinyatakan aktif hanya jika
sudah diuji pada beberapa klien.

·        
Konfigurasi scene dapat diperluas tanpa menulis
ulang inti aplikasi.

·        
Tes wajib lulus.

·        
Batasan dan risiko keamanan didokumentasikan.

·        
Status database dan deployment telah
diverifikasi.

·        
Tidak ada dependensi berbayar wajib.

·        
Dokumentasi setup, environment, pengujian, dan
deployment tersedia.

## 25. INSTRUKSI EKSEKUSI PERTAMA

Mulai sekarang:

1.     
Audit repository RUANG KITA yang tersedia dan akses
GitHub yang benar-benar diberikan.

2.     
Jangan membuat repository duplikat jika repository yang
tepat sudah ada.

3.     
Jika repository belum tersedia atau akses belum
terhubung, laporkan hambatan dengan jelas dan siapkan artefak lokal atau dokumen
yang dapat ditinjau.

4.     
Susun architecture decision record dan rencana Phase 0.

5.     
Mulai Phase 1 dengan scene angkringan yang benar-benar
dapat dijalankan.

6.     
Tambahkan dua scene lain melalui sistem konfigurasi
yang sama.

7.     
Uji hasil pada browser dan dokumentasikan hasil
sebenarnya.

8.     
Lanjutkan fase berikutnya secara bertahap setelah
quality gate terpenuhi.

9.     
Jangan mengaktifkan layanan berbayar atau melakukan
perubahan destruktif tanpa otorisasi.

10.  Utamakan
hasil yang berfungsi, biaya terkendali, keamanan, dan kemudahan pengembangan
daripada banyaknya fitur yang belum selesai.

HASIL PERTAMA YANG DITUJU:

RUANG KITA dapat dibuka di browser, pengguna masuk ke ANGKRINGAN KITA, melihat
avatar 3D, bergerak menjelajahi lingkungan, dan berpindah ke dua scene lain.
Fondasi harus memungkinkan scene dan kemampuan baru ditambahkan tanpa membangun
ulang seluruh aplikasi.

---

## 26. ADDENDUM EKSEKUSI — PRIORITAS RUANG KITA

Bagian ini melengkapi roadmap asli dan tidak menggantikan audit Phase 0.

1. **P0 — Pulihkan rendering:** cari akar masalah dunia/gambar kosong dengan memeriksa module, import map, WebGL, ukuran renderer, aset, render loop, dan browser errors. Jangan menambah fitur sebelum runtime 3D terverifikasi.
2. **P1 — Stabilkan adapter engine:** pertahankan satu renderer utama; uji GLB nyata dan jalur gagal. Catat bahwa adapter aset bukan integrasi runtime penuh Babylon.js/Godot.
3. **P2 — Audit collision/movement:** pastikan signature fungsi collision konsisten; uji avatar, NPC, kendaraan, bangunan, furnitur, dan interaksi.
4. **P3 — Instrumentasi dunia:** catat collision event, blocked path, stuck agent, asset failure, dan frame-time spike dengan severity serta tindakan aman.
5. **P4 — Multi-agent bertahap:** mulai dari agen deterministik dengan kontrak dan izin jelas; gunakan model bahasa on-demand bila tersedia dan diizinkan.
6. **P5 — Regression dan deploy:** jalankan quality gates, review diff, dry-run, deploy hanya jika layak, lalu verifikasi URL live. Jika verifikasi tidak tersedia, tandai `NOT TESTED`.

### Batas perbaikan otomatis
- Runtime: pengereman, menunggu, menghindari rintangan, memilih waypoint alternatif, fallback aset, menurunkan detail visual, dan recovery state tervalidasi.
- Development: agen boleh menyiapkan patch dan tes di sandbox/branch; perubahan produksi mengikuti quality gate, otorisasi yang diperlukan, dan rollback.
- Tidak boleh: perubahan destruktif data produksi, pembukaan data privat, secret di client, aktivasi billing, atau perluasan izin agen sendiri.

### Format laporan
Setiap iterasi mencantumkan status (`DONE`, `PARTIAL`, `BLOCKED`, `NOT TESTED`, `NOT STARTED`), file yang berubah, bukti tes/build/runtime, commit/deployment terverifikasi, dampak, risiko tersisa, dan tindakan berikutnya. Jangan membuat hasil tes atau deployment fiktif.
