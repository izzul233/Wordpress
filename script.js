
/* ---------- Menu mobile ---------- */
var nav = document.getElementById('nav');
var menuBtn = document.getElementById('menuBtn');

menuBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  var open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
document.addEventListener('click', function (e) {
  if (!nav.contains(e.target)) nav.classList.remove('open');
});

/* ---------- Filter + pencarian + pagination ---------- */
var cards = document.querySelectorAll('#grid .post-card');
var chips = document.querySelectorAll('.filter-btn');
var input = document.getElementById('q');
var empty = document.getElementById('empty');
var pager = document.getElementById('pager');

var PER_HALAMAN = 6;
var kategori = 'all';
var halaman = 1;

function tampilkan() {
  var kata = input.value.trim().toLowerCase();

  var cocok = [];
  cards.forEach(function (card) {
    var okKategori = kategori === 'all' || card.dataset.cat === kategori;
    var okKata = card.textContent.toLowerCase().includes(kata);
    if (okKategori && okKata) cocok.push(card);
  });

  var totalHalaman = Math.max(1, Math.ceil(cocok.length / PER_HALAMAN));
  if (halaman > totalHalaman) halaman = totalHalaman;
  var mulai = (halaman - 1) * PER_HALAMAN;
  var tampil = cocok.slice(mulai, mulai + PER_HALAMAN);

  cards.forEach(function (card) {
    card.hidden = tampil.indexOf(card) === -1;
  });
  empty.hidden = cocok.length > 0;

  chips.forEach(function (c) {
    c.classList.toggle('active', c.dataset.cat === kategori);
  });

  buatPager(totalHalaman);
}

function buatPager(total) {
  pager.innerHTML = '';
  if (total <= 1) return;

  tambahTombol('‹', halaman - 1, halaman === 1, 'Halaman sebelumnya');
  for (var i = 1; i <= total; i++) {
    tambahTombol(String(i), i, false, 'Halaman ' + i);
  }
  tambahTombol('›', halaman + 1, halaman === total, 'Halaman berikutnya');
}

function tambahTombol(teks, tujuan, nonaktif, label) {
  var b = document.createElement('button');
  b.type = 'button';
  b.textContent = teks;
  b.disabled = nonaktif;
  b.setAttribute('aria-label', label);
  if (String(tujuan) === teks && tujuan === halaman) {
    b.classList.add('active');
    b.setAttribute('aria-current', 'page');
  }
  b.addEventListener('click', function () {
    halaman = tujuan;
    tampilkan();
    document.getElementById('terbaru').scrollIntoView({ behavior: 'smooth' });
  });
  pager.appendChild(b);
}

function pilihKategori(nama) {
  kategori = nama;
  halaman = 1;
  tampilkan();
}

chips.forEach(function (c) {
  c.addEventListener('click', function () { pilihKategori(c.dataset.cat); });
});

document.querySelectorAll('[data-go]').forEach(function (a) {
  a.addEventListener('click', function () {
    input.value = '';
    pilihKategori(a.dataset.go);
    nav.classList.remove('open');
  });
});

input.addEventListener('input', function () {
  halaman = 1;
  tampilkan();
});
document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  halaman = 1;
  tampilkan();
});

tampilkan();

/* ---------- Tahun footer ---------- */
document.getElementById('yr').textContent = new Date().getFullYear();
