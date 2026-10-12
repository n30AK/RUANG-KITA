window.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('mainNav');
  const shrink = () => {
    if (!mainNav) return;
    mainNav.classList.toggle('navbar-shrink', window.scrollY > 0);
  };
  shrink();
  document.addEventListener('scroll', shrink, { passive: true });

  const toggler = document.querySelector('.navbar-toggler');
  document.querySelectorAll('#navbarResponsive .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (toggler && window.getComputedStyle(toggler).display !== 'none') toggler.click();
    });
  });

  const grid = document.getElementById('community-grid');
  if (!grid) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
  const categoryImages = [
    '/assets/img/portfolio/1.jpg','/assets/img/portfolio/2.jpg',
    '/assets/img/portfolio/3.jpg','/assets/img/portfolio/4.jpg',
    '/assets/img/portfolio/5.jpg','/assets/img/portfolio/6.jpg'
  ];
  const iconFor = scene => ({
    cafe:'fa-mug-hot',angkringan:'fa-store',pendopo:'fa-people-roof',expo:'fa-images',
    karaoke:'fa-microphone',school:'fa-graduation-cap',family:'fa-house',
    office:'fa-briefcase',neighborhood:'fa-house-user',worship:'fa-hands-praying',
    sports:'fa-futbol',hobby:'fa-palette',learning:'fa-book-open',umkm:'fa-basket-shopping',
    volunteer:'fa-handshake-angle',travel:'fa-compass',health:'fa-heart',
    alumni:'fa-user-group',podcast:'fa-podcast'
  }[scene] || 'fa-people-group');

  fetch('/api/communities', { headers: { 'Accept': 'application/json' } })
    .then(async response => {
      if (!response.ok) throw new Error('Daftar komunitas belum dapat dimuat.');
      return response.json();
    })
    .then(data => {
      const communities = (data.communities || []).filter(c => c.visibility === 'public');
      if (!communities.length) {
        grid.innerHTML = '<div class="col-12"><div class="empty-state"><i class="fas fa-door-open fa-2x mb-3"></i><h5>Belum ada komunitas publik</h5><p class="mb-3">Jadilah yang pertama membuat ruang terbuka untuk komunitas Anda.</p><a class="btn btn-primary" href="/login">Buat komunitas</a></div></div>';
        return;
      }
      grid.innerHTML = communities.map((c, index) => {
        const image = categoryImages[index % categoryImages.length];
        const href = '/komunitas/' + encodeURIComponent(c.id);
        return '<div class="col-lg-4 col-sm-6 mb-4"><div class="portfolio-item">' +
          '<a class="portfolio-link" href="' + href + '" aria-label="Buka komunitas ' + esc(c.name) + '">' +
          '<div class="portfolio-hover"><div class="portfolio-hover-content"><i class="fas fa-arrow-up-right-from-square fa-2x"></i></div></div>' +
          '<img class="img-fluid" src="' + image + '" alt="Ilustrasi kategori ' + esc(c.category || 'komunitas') + '" loading="lazy"></a>' +
          '<div class="portfolio-caption"><div class="portfolio-caption-heading">' + esc(c.name) + '</div>' +
          '<div class="portfolio-caption-subheading text-muted">' + esc(c.category || 'Umum') + ' · ' + Number(c.member_count || 0) + ' anggota</div>' +
          '<p class="text-muted small mt-2 mb-3">' + esc(c.description || 'Ruang komunitas publik.') + '</p>' +
          '<a class="btn btn-outline-dark btn-sm" href="' + href + '">Lihat ruang <i class="fas fa-arrow-right ms-1"></i></a></div></div></div>';
      }).join('');
    })
    .catch(() => {
      grid.innerHTML = '<div class="col-12"><div class="empty-state"><i class="fas fa-cloud-arrow-down fa-2x mb-3"></i><h5>Daftar komunitas belum tersedia</h5><p class="mb-3">Anda tetap dapat masuk untuk mengelola atau membuat ruang komunitas.</p><a class="btn btn-primary" href="/login">Masuk ke RUANG KITA</a></div></div>';
    });
});