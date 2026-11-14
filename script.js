/* =========================================================
   BYTEFORGE – script.js (versi sederhana)
   Fitur:
   1. Menu mobile
   2. Filter kategori + pencarian + pagination
   3. Tahun footer
   ========================================================= */

/* ---------- 1. Menu mobile ---------- */
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

/* ---------- 2. Filter + pencarian + pagination ---------- */
var cards = document.querySelectorAll('#grid .card');
var chips = document.querySelectorAll('.chip');
var input = document.getElementById('q');
var empty = document.getElementById('empty');
var pager = document.getElementById('pager');

var PER_HALAMAN = 6;   // jumlah berita per halaman
var kategori = 'all';
var halaman = 1;

function tampilkan() {
  var kata = input.value.trim().toLowerCase();

  // 1) kumpulkan kartu yang cocok dengan kategori DAN kata kunci
  var cocok = [];
  cards.forEach(function (card) {
    var okKategori = kategori === 'all' || card.dataset.cat === kategori;
    var okKata = card.textContent.toLowerCase().includes(kata);
    if (okKategori && okKata) cocok.push(card);
  });

  // 2) hitung total halaman, lalu ambil kartu untuk halaman ini
  var totalHalaman = Math.max(1, Math.ceil(cocok.length / PER_HALAMAN));
  if (halaman > totalHalaman) halaman = totalHalaman;
  var mulai = (halaman - 1) * PER_HALAMAN;
  var tampil = cocok.slice(mulai, mulai + PER_HALAMAN);

  // 3) tampilkan / sembunyikan kartu
  cards.forEach(function (card) {
    card.hidden = tampil.indexOf(card) === -1;
  });
  empty.hidden = cocok.length > 0;

  // 4) tandai tombol kategori yang aktif
  chips.forEach(function (c) {
    c.classList.toggle('on', c.dataset.cat === kategori);
  });

  buatPager(totalHalaman);
}

// Membuat tombol ‹ 1 2 ›
function buatPager(total) {
  pager.innerHTML = '';
  if (total <= 1) return;   // satu halaman saja: pagination disembunyikan

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
    b.classList.add('on');
    b.setAttribute('aria-current', 'page');
  }
  b.addEventListener('click', function () {
    halaman = tujuan;
    tampilkan();
    document.getElementById('terbaru').scrollIntoView({ behavior: 'smooth' });
  });
  pager.appendChild(b);
}

// Ganti kategori selalu kembali ke halaman 1
function pilihKategori(nama) {
  kategori = nama;
  halaman = 1;
  tampilkan();
}

// Tombol filter di atas daftar berita
chips.forEach(function (c) {
  c.addEventListener('click', function () { pilihKategori(c.dataset.cat); });
});

// Menu atas dan kategori di sidebar (atribut data-go)
document.querySelectorAll('[data-go]').forEach(function (a) {
  a.addEventListener('click', function () {
    input.value = '';
    pilihKategori(a.dataset.go);
    nav.classList.remove('open');
  });
});

// Kolom pencarian
input.addEventListener('input', function () {
  halaman = 1;
  tampilkan();
});
document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  halaman = 1;
  tampilkan();
});

tampilkan();   // tampilan awal

/* ---------- 3. Tahun footer ---------- */
document.getElementById('yr').textContent = new Date().getFullYear();
