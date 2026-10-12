"use client";

import { useMemo, useState } from "react";

type SceneId = "cafe" | "angkringan" | "pendopo" | "expo" | "karaoke";

const scenes: { id: SceneId; name: string; note: string; emoji: string }[] = [
  { id: "cafe", name: "Kafe komunitas", note: "Hangat & produktif", emoji: "☕" },
  { id: "angkringan", name: "Angkringan", note: "Santai ala Nusantara", emoji: "🏮" },
  { id: "pendopo", name: "Pendopo", note: "Musyawarah bersama", emoji: "🌿" },
  { id: "expo", name: "Expo hall", note: "Pameran lintas grup", emoji: "🖼️" },
  { id: "karaoke", name: "Panggung Karaoke", note: "Tampil, bernyanyi & beri apresiasi", emoji: "🎤" },
];

const rooms = [
  { name: "Kafe Senja", kind: "Silaturahmi", scene: "cafe", access: "Publik", people: "12 anggota", emoji: "☕", color: "peach" },
  { name: "Angkringan Warga", kind: "Komunitas lokal", scene: "angkringan", access: "Undangan", people: "8 anggota", emoji: "🏮", color: "amber" },
  { name: "Pendopo Alumni", kind: "Alumni", scene: "pendopo", access: "Publik", people: "24 anggota", emoji: "🌿", color: "sage" },
  { name: "Galeri Karya Kita", kind: "Pameran", scene: "expo", access: "Publik", people: "6 stan", emoji: "🖼️", color: "lilac" },
  { name: "Panggung Karaoke Bersama", kind: "Hiburan komunitas", scene: "karaoke", access: "Undangan", people: "Daftar tampil demo", emoji: "🎤", color: "plum" },
];

const tables = [
  { name: "Meja Alumni 2004", subtitle: "Diskusi reuni & kabar teman", seats: "4 kursi", emoji: "🪑", status: "Sedang berkumpul" },
  { name: "Meja UMKM Lokal", subtitle: "Berbagi produk dan peluang", seats: "6 kursi", emoji: "🛍️", status: "Terbuka untuk tamu" },
  { name: "Meja Panitia", subtitle: "Agenda dan persiapan acara", seats: "4 kursi", emoji: "🗓️", status: "Khusus anggota" },
  { name: "Daftar Tampil Karaoke", subtitle: "Antrean penyanyi dan lagu pilihan", seats: "Slot tampil", emoji: "🎤", status: "Dikelola moderator" },
];

export default function Home() {
  const [scene, setScene] = useState<SceneId>("cafe");
  const [roomFilter, setRoomFilter] = useState<"Semua" | "Publik" | "Undangan">("Semua");
  const [notice, setNotice] = useState("");
  const activeScene = scenes.find((item) => item.id === scene) ?? scenes[0];
  const visibleRooms = useMemo(
    () => rooms.filter((room) => (roomFilter === "Semua" ? true : room.access === roomFilter)),
    [roomFilter],
  );

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="RUANG KITA beranda">
          <span className="brand-mark">rk</span>
          <span>RUANG<span className="brand-light">KITA</span><small>RUANG SILATURAHMI DIGITAL</small></span>
        </a>
        <nav className="main-nav" aria-label="Navigasi utama">
          <a className="active" href="#jelajah">Jelajahi ruang</a>
          <a href="#cara-kerja">Cara kerja</a>
          <a href="#pameran">Pameran</a>
        </nav>
        <div className="top-actions">
          <span className="demo-pill"><i /> Pratinjau MVP</span>
          <a className="button button-dark button-small" href="#jelajah">Masuk ruang <span>↗</span></a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> TEMPAT BERKUMPUL, DENGAN CARA BARU</div>
          <h1>Grup punya meja.<br /><em>Silaturahmi</em> punya ruang.</h1>
          <p className="hero-description">Rumah digital untuk komunitasmu. Pilih suasana, ajak grup WhatsApp, lalu bertemu, berbagi cerita, bernyanyi di panggung, dan menemukan komunitas lain.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#jelajah">Jelajahi ruang <span>↗</span></a>
            <a className="button button-outline" href="#cara-kerja">Kenali cara kerja</a>
          </div>
          <div className="hero-footnote"><span className="avatars"><b>Y</b><b>A</b><b>R</b><b>+</b></span><span>Komunitas yang berbeda, satu tempat untuk bertemu.</span></div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi ruang kafe digital">
          <div className="art-sun" />
          <div className="art-window"><span /><span /><span /><span /></div>
          <div className="plant plant-left">♧</div>
          <div className="pendant pendant-one" /><div className="pendant pendant-two" />
          <div className="art-label"><span className="live-dot" /> RUANG TERBUKA <b>12 hadir</b></div>
          <div className="scene-room">
            <div className="back-sofa" />
            <div className="round-table"><span className="cup">☕</span><span className="leaf">✿</span></div>
            <div className="chair chair-one"><i /></div><div className="chair chair-two"><i /></div><div className="chair chair-three"><i /></div>
            <div className="floor-rug" />
          </div>
          <div className="floating-note note-top"><span>✦</span><div><b>Meja Alumni</b><small>Diskusi terbuka</small></div><span className="note-arrow">↗</span></div>
          <div className="floating-note note-bottom"><span className="note-avatar">U</span><div><b>UMKM Bersama</b><small>6 kursi tersedia</small></div></div>
          <div className="art-caption">01 / KAFE KOMUNITAS <span>Geser suasana, pilih ceritamu.</span></div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Prinsip produk">
        <div><span>01</span><b>Ruang untuk semua</b><small>Publik atau privat, kamu yang atur.</small></div>
        <div><span>02</span><b>Grup tetap punya identitas</b><small>Setiap komunitas punya mejanya sendiri.</small></div>
        <div><span>03</span><b>Berawal dari yang sederhana</b><small>Ringan di ponsel, berkembang ke 3D.</small></div>
      </section>

      <section className="section explore-section" id="jelajah">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line" /> TEMUKAN SUASANANYA</div><h2>Satu ruang, banyak <em>kemungkinan.</em></h2></div>
          <p>Dari obrolan santai sampai pameran lintas komunitas. Pilih tempat yang paling cocok untuk cerita kalian.</p>
        </div>
        <div className="scene-picker" role="group" aria-label="Pilih suasana ruang">
          {scenes.map((item) => <button key={item.id} className={scene === item.id ? "scene-option selected" : "scene-option"} onClick={() => setScene(item.id)} aria-pressed={scene === item.id}>
            <span className={"scene-icon scene-" + item.id}>{item.emoji}</span><span className="scene-text"><b>{item.name}</b><small>{item.note}</small></span><span className="scene-chevron">↗</span>
          </button>)}
        </div>
        <div className={"selected-scene scene-preview preview-" + scene}>
          <div className="preview-topline"><span className="preview-tag">{activeScene.emoji} SCENE PILIHAN</span><span className="preview-status"><i /> Ruang contoh</span></div>
          <div className="preview-center">
            <div className="preview-window"><span /><span /><span /><span /></div>
            <div className="preview-plant">♧</div>
            <div className="preview-table"><span>✿</span><i /></div>
            <div className="preview-chair c1" /><div className="preview-chair c2" /><div className="preview-chair c3" />
            <div className="preview-seat-label seat-label-one">Meja komunitas <b>4 kursi</b></div>
            <div className="preview-seat-label seat-label-two">Area bersama <b>Terbuka</b></div>
          </div>
          <div className="preview-bottom"><div><small>SUASANA SAAT INI</small><h3>{activeScene.name}</h3><p>{activeScene.note}. Pilih meja, undang anggota, mulai kegiatan.</p>{scene === "karaoke" && <small className="karaoke-note">🎶 Demo konsep: antrean tampil, moderator, dan apresiasi. Audio/video karaoke belum aktif.</small>}</div><button className="button button-dark" onClick={() => setNotice("Pratinjau " + activeScene.name + " dipilih. Fitur masuk room akan dihubungkan setelah autentikasi siap.")}>Lihat ruang <span>↗</span></button></div>
        </div>
      </section>

      <section className="section rooms-section">
        <div className="section-heading compact-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> RUANG YANG BISA DIKUNJUNGI</div><h2>Tempat cerita <em>dimulai.</em></h2></div>
          <div className="filter-tabs" role="group" aria-label="Filter ruang">{(["Semua", "Publik", "Undangan"] as const).map((filter) => <button key={filter} onClick={() => setRoomFilter(filter)} className={roomFilter === filter ? "filter-active" : ""} aria-pressed={roomFilter === filter}>{filter}</button>)}</div>
        </div>
        <div className="room-grid">
          {visibleRooms.map((room) => <article className="room-card" key={room.name}>
            <div className={"room-card-art art-" + room.color}><span className="room-emoji">{room.emoji}</span><span className="room-access">{room.access === "Publik" ? "↗ Publik" : "♧ Undangan"}</span><span className="room-orbit" /></div>
            <div className="room-card-body"><div className="room-kind">{room.kind}</div><h3>{room.name}</h3><div className="room-card-footer"><span>◉ {room.people}</span><button aria-label={"Pilih " + room.name} onClick={() => setNotice(room.name + " adalah data demo. Akses nyata akan aktif setelah backend dan izin selesai diuji.")}>Kunjungi <span>↗</span></button></div></div>
          </article>)}
        </div>
        {visibleRooms.length === 0 && <p className="empty-state">Belum ada ruang untuk filter ini.</p>}
        <p className="demo-disclaimer">Ruang dan jumlah anggota pada pratinjau ini adalah data contoh, bukan komunitas aktif. Panggung karaoke juga masih berupa konsep visual; audio, sinkronisasi lagu, dan video belum diimplementasikan.</p>
      </section>

      <section className="section table-section" id="cara-kerja">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> MEJA MILIK KOMUNITAS</div><h2>Datang bersama.<br /><em>Duduk di meja sendiri.</em></h2></div><p>Satu room bisa menampung beberapa grup. Tiap meja tetap memiliki anggota, percakapan, dan pengaturan akses sendiri.</p></div>
        <div className="table-layout">
          <div className="table-stage">
            <div className="stage-window" /><div className="stage-plant">♧</div><div className="stage-lamp" />
            <div className="community-table table-a"><span className="table-cup">☕</span><b>Alumni 2004</b><small>4 kursi</small><i className="seat s1" /><i className="seat s2" /><i className="seat s3" /><i className="seat s4" /></div>
            <div className="community-table table-b"><span className="table-cup">✿</span><b>UMKM Lokal</b><small>6 kursi</small><i className="seat s1" /><i className="seat s2" /><i className="seat s3" /><i className="seat s4" /></div>
            <div className="stage-floor-label">KAFE SENJA <span>•</span> RUANG BERSAMA</div>
          </div>
          <div className="table-details">
            <div className="table-details-intro"><span className="detail-number">01 — 03</span><h3>Setiap meja punya<br />ceritanya sendiri.</h3><p>Meja mewakili komunitas atau aktivitas, bukan sekadar dekorasi. Pengelola menentukan siapa yang boleh bergabung.</p></div>
            {tables.map((table, index) => <div className="table-list-item" key={table.name}><span className="table-list-icon">{table.emoji}</span><div><b>{table.name}</b><small>{table.subtitle}</small><span className="table-status">{table.status}</span></div><span className="table-seats">{table.seats}</span><span className="table-index">0{index + 1}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section expo-section" id="pameran">
        <div className="expo-copy"><div className="eyebrow"><span className="eyebrow-line" /> BERTEMU LEBIH JAUH</div><h2>Satu pintu.<br />Banyak <em>komunitas.</em></h2><p>Expo Hall mempertemukan kreator, UMKM, alumni, dan komunitas yang berbeda. Pengunjung bisa menjelajahi stan, melihat karya, dan mengikuti presentasi sesuai izin.</p><a className="button button-light" href="#jelajah">Jelajahi konsep <span>↗</span></a><div className="expo-note"><span>✦</span> Ruang publik bisa dikunjungi. Meja privat tetap terlindungi.</div></div>
        <div className="expo-visual"><div className="expo-hall-title">GALERI KOMUNITAS <span>OPEN HOUSE · DEMO</span></div><div className="expo-booths"><div className="booth booth-one"><span>🎨</span><b>Karya Kreatif</b><small>Portofolio & seni</small></div><div className="booth booth-two"><span>🧺</span><b>Produk Lokal</b><small>UMKM bersama</small></div><div className="booth booth-three"><span>📚</span><b>Ruang Belajar</b><small>Kelas & komunitas</small></div></div><div className="expo-floor" /><div className="expo-foot">3 CONTOH STAN <span>·</span> 1 RUANG BERSAMA</div></div>
      </section>

      <section className="section how-section">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> MUDAH UNTUK DIMULAI</div><h2>Dari WhatsApp ke <em>ruang bersama.</em></h2></div><p>WhatsApp tetap menjadi tempat percakapan harian. RUANG KITA menambahkan rumah untuk agenda, acara, pustaka, dan pertemuan.</p></div>
        <div className="steps-grid"><article><span className="step-no">01</span><span className="step-emoji">🏡</span><h3>Buat ruang</h3><p>Pilih scene, beri nama room, dan tentukan apakah publik atau privat.</p></article><article><span className="step-no">02</span><span className="step-emoji">🔗</span><h3>Bagikan undangan</h3><p>Kirim tautan atau QR ke grup WhatsApp. Anggota bergabung sesuai izin.</p></article><article><span className="step-no">03</span><span className="step-emoji">🪑</span><h3>Pilih meja</h3><p>Setiap komunitas punya meja. Room bersama dapat mengundang komunitas lain.</p></article><article><span className="step-no">04</span><span className="step-emoji">🎥</span><h3>Mulai kegiatan</h3><p>Atur agenda, RSVP, pustaka, tautan meeting, atau sesi hiburan seperti karaoke. Video terintegrasi menyusul.</p></article></div>
      </section>

      <section className="closing-cta"><div><div className="eyebrow"><span className="eyebrow-line" /> MULAI DARI SATU MEJA</div><h2>Silaturahmi selalu<br />punya <em>tempat.</em></h2><p>Ruang yang hangat, komunitas yang terhubung, dan cerita yang terus berjalan.</p></div><a className="button button-light" href="#jelajah">Lihat pratinjau ruang <span>↗</span></a></section>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark">rk</span><span>RUANG<span className="brand-light">KITA</span><small>RUANG SILATURAHMI DIGITAL</small></span></a><span>Tempat bertemu, bukan sekadar tempat online.</span><span>Pratinjau MVP · Belum terhubung ke akun atau database</span></footer>
      {notice && <div className="toast" role="status"><span>✦</span>{notice}<button onClick={() => setNotice("")} aria-label="Tutup pemberitahuan">×</button></div>}
    </main>
  );
}
