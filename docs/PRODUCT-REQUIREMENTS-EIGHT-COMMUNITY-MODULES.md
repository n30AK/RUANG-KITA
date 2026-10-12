# RUANG KITA — Delapan Modul Produk Wajib

Tanggal: 12 Oktober 2026  
Status: spesifikasi produk disepakati sebagai target implementasi; belum berarti modul aktif atau siap produksi.

## Prinsip umum

1. Semua data komunitas bersifat tenant-scoped. Backend memeriksa identitas, membership, role, visibilitas, dan status publikasi pada setiap permintaan.
2. Data demo diberi label jelas dan tidak boleh disajikan sebagai data anggota, transaksi, acara, atau statistik sungguhan.
3. Akses publik, anggota, admin, undangan, dan anggota terverifikasi adalah aturan yang berbeda. Status "terverifikasi" harus mempunyai prosedur, jejak audit, dan mekanisme banding.
4. AI hanya boleh mengambil sumber yang dapat dibaca oleh pengguna saat itu. AI tidak boleh menaikkan hak akses atau mengungkap isi ruang lain.
5. Semua tindakan sensitif perlu jejak audit. Dana sosial memerlukan pemisahan pencatat dan penyetuju; sistem ini tidak boleh mengaku memproses pembayaran jika payment gateway belum dibuat.
6. Fitur audio/video, penyimpanan media, transkripsi, dan notifikasi baru boleh dinyatakan aktif setelah provider, persetujuan, batas biaya, penghapusan, serta uji akses selesai.
7. Jangan menerapkan migration ke Neon production sampai migration diuji pada branch development, RLS/authorization diuji positif-negatif, backup tersedia, dan persetujuan eksplisit diberikan.

## 1. Beranda khusus setiap komunitas

Setiap komunitas memiliki URL/slug dan halaman detail sendiri dengan:
- Logo, cover, nama, deskripsi, visi, misi, kategori, dan tautan resmi opsional.
- Pengurus/pejabat komunitas dengan jabatan, masa tugas, urutan tampilan, dan visibilitas.
- Direktori anggota sesuai opt-in dan kebijakan privasi.
- Agenda mendatang, pengumuman tersemat, aktivitas terbaru, dan pencapaian/riwayat.
- Mode publik, privat, undangan, serta aturan khusus untuk anggota terverifikasi.
- Pengaturan persetujuan anggota, pelaporan, moderasi, dan pemilik yang bertanggung jawab.

Kriteria penerimaan: pengguna anonim hanya melihat halaman dan bagian publik; anggota melihat konten anggota; anggota yang tidak lolos verifikasi tidak dapat membuka konten verified-only melalui URL langsung atau API.

## 2. Podcast dan arsip pengetahuan

- Acara/serial, episode, host/co-host, metadata, tautan eksternal, dan arsip.
- Unggah/pemutaran audio hanya setelah storage dan hak akses file aman diterapkan.
- Rekaman memerlukan persetujuan yang tercatat dari seluruh peserta yang diwajibkan; sediakan pemberitahuan sebelum rekam, indikator rekam, penghentian, penarikan persetujuan bila berlaku, dan kebijakan retensi.
- Transkripsi, ringkasan, topik, poin utama, dan FAQ adalah artefak turunan yang diberi status draft/review/publish.
- Hasil AI tidak dipublikasikan otomatis; moderator/host dapat mengoreksi atau menghapusnya.
- Sediakan atribusi, pelaporan pelanggaran hak cipta, dan kontrol visibilitas per episode.

## 3. Kalender dan agenda

- Agenda komunitas dengan zona waktu yang eksplisit, status, lokasi/tautan rapat, penyelenggara, dan daftar dokumen.
- RSVP: hadir, mungkin, tidak hadir; pengguna dapat memperbarui jawaban.
- Pengingat hanya setelah preferensi notifikasi dan kanal pengiriman dikonfigurasi; jangan mengklaim pengingat terkirim bila belum ada provider.
- Ekspor kalender ICS; tautan Zoom/Google Meet eksternal; daftar peserta dibatasi sesuai visibilitas.
- Notulen dan keputusan memiliki pemilik, status draft/published, tanggal, dan akses yang sama atau lebih ketat daripada acara.

## 4. Direktori anggota dan pencocokan minat

- Keahlian, minat, kota, bidang usaha, kebutuhan kolaborasi/mentoring, dan ringkasan profil bersifat sukarela.
- Opt-in eksplisit dan pengaturan visibilitas privat/komunitas/publik.
- Detail kontak tersembunyi secara default; gunakan permintaan perkenalan atau WhatsApp opt-in, bukan membocorkan nomor anggota.
- Pencarian dan rekomendasi mentor, mitra usaha, fotografer, pembicara, relawan, dan kolaborator harus dapat dijelaskan dengan faktor yang relevan.
- Pengguna dapat mengubah data, keluar dari direktori, dan menghapus/menyembunyikan detail sesuai kebijakan retensi.

## 5. Marketplace internal

- Jenis listing: produk, jasa, lowongan, kolaborasi, magang, dan pengadaan.
- Status moderasi: pending, approved, rejected, removed; hanya listing approved yang tampil.
- Harga, mata uang, lokasi, masa berlaku, pemilik listing, dan kanal kontak opsional.
- WhatsApp hanya untuk kontak yang sengaja dibagikan oleh pemilik listing. Jangan melakukan pengiriman otomatis tanpa persetujuan.
- MVP tidak memproses pembayaran atau menjamin kualitas penjual; tampilkan aturan, pelaporan, dan disclaimer.
- Listing yang kedaluwarsa disembunyikan dan dapat diarsipkan.

## 6. Asisten AI komunitas

- Menjawab pertanyaan berdasarkan agenda, pengumuman, notulen, pustaka, podcast, listing, dan arsip yang diizinkan.
- Jawaban menampilkan sumber yang digunakan, tanggal, dan tautan ke sumber jika pengguna berhak membukanya.
- Admin dapat meminta draf pengumuman, ringkasan kegiatan, agenda, FAQ, atau laporan; semua hasil adalah draft sampai disetujui manusia.
- Tool allowlist, batas biaya, rate limit, audit metadata, proteksi prompt injection, dan tombol menonaktifkan AI per komunitas.
- Tidak menyimpan chain-of-thought tersembunyi; jangan mengirim data anak, kesehatan, agama, atau data sensitif ke model eksternal tanpa dasar hukum, pemberitahuan, dan persetujuan yang sesuai.
- AI tidak boleh mengubah dana, mengirim pesan massal, menjatuhkan sanksi, atau memublikasikan konten tanpa persetujuan yang tepat.

## 7. Dana sosial dan kegiatan bersama

- Dana terpisah untuk iuran, donasi, kegiatan, bantuan, dan kas umum.
- Catatan pemasukan/pengeluaran, tujuan, jumlah, mata uang, tanggal, kategori, bukti transaksi, status, pencatat, dan penyetuju.
- Pisahkan pembuat/pencatat dari penyetuju; setiap keputusan persetujuan dan penolakan harus diaudit.
- Laporan saldo dihitung dari transaksi yang disetujui saja, disertai filter periode/kategori dan ekspor yang sesuai hak akses.
- Jangan menyimpan kredensial bank/kartu. Jangan menyatakan donasi berhasil diterima tanpa integrasi pembayaran atau verifikasi manual.
- Transaksi tidak dihapus secara diam-diam; koreksi dilakukan dengan void/reversal yang dapat diaudit. Perlu review akuntansi, pajak, dan kepatuhan sebelum produksi.

## 8. Memori dan sejarah komunitas

- Kronologi, cerita anggota, foto album, video, dokumen, pencapaian, dan arsip acara.
- Metadata tanggal/peristiwa, kontributor, atribusi, visibilitas, status moderasi, dan masa retensi.
- Penyimpanan media menggunakan signed URL dan pemeriksaan otorisasi di server; tautan file tidak boleh membuka konten privat secara permanen.
- Dukungan laporan, penghapusan, hak cipta, persetujuan publikasi, serta perlindungan data pribadi.
- Pencarian dan ringkasan AI harus mengikuti aturan akses sumber; arsip admin-only tidak boleh masuk jawaban publik.

## Urutan implementasi

### Gelombang 1 — fondasi aman
- Autentikasi dan profil, komunitas/slug, beranda, pengurus, membership, verified-only policy.
- Agenda/RSVP, pengumuman, pustaka dokumen, aktivitas terbaru.
- Authorization/RLS dan allow/deny tests sebelum data riil digunakan.

### Gelombang 2 — discovery dan memori
- Direktori opt-in, pencarian keahlian/minat, arsip komunitas, moderasi media, ekspor kalender ICS.
- Marketplace listing dengan moderasi dan kontak sukarela.

### Gelombang 3 — pengetahuan dan podcast
- Podcast metadata/tautan eksternal terlebih dahulu; kemudian storage/pemutaran.
- Knowledge source registry, transkripsi/ringkasan dengan persetujuan dan review manusia.
- Asisten AI dengan retrieval yang tenant-scoped dan citation/source links.

### Gelombang 4 — dana sosial
- Ledger, bukti, approval separation, rekonsiliasi, audit dan laporan.
- Review keamanan, akuntansi, pajak, perlindungan konsumen, dan regulasi terkait sebelum membuka akses publik.

## Definisi "live"

Preview URL bukan bukti produksi. RUANG KITA hanya dapat disebut live untuk ruang lingkup tertentu setelah:
- hosting production dan domain/URL diketahui;
- CI lulus untuk commit yang tepat;
- environment variables tersimpan aman dan backend terhubung;
- auth, authorization/RLS, database, media, error handling, dan backup/restore diuji;
- health check dan smoke test publik berhasil;
- tidak ada demo data yang disamarkan sebagai data nyata;
- fitur yang belum ada diberi label belum tersedia;
- pemilik menyetujui perubahan database production dan biaya provider bila diperlukan.
