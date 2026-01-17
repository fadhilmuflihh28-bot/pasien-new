const app = document.getElementById("app");

/* ================= STORAGE ================= */
function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function load(key) {
  return JSON.parse(localStorage.getItem(key)) || {};
}

/* ================= HALAMAN AWAL ================= */
function welcome() {
  app.innerHTML = `
    <h2>Selamat Datang 👋</h2>
    <p>Sistem Pemeriksaan Pasien</p>
    <button onclick="loginDokter()">Dokter</button>
    <button onclick="halamanPasien()">Pasien</button>
  `;
}

/* ================= LOGIN DOKTER ================= */
function loginDokter() {
  app.innerHTML = `
    <h3>Login Dokter</h3>
    <input id="user" placeholder="Username">
    <input id="pw" type="password" placeholder="Password">
    <button onclick="cekLogin()">Login</button>
    <button onclick="register()">Daftar</button>
    <button onclick="welcome()">Kembali</button>
  `;
}

function cekLogin() {
  const user = document.getElementById("user").value.trim();
  const pw = document.getElementById("pw").value.trim();
  const akun = load("akun");

  if (!user || !pw) {
    alert("Username dan password wajib diisi");
    return;
  }

  if (akun[user] === pw) {
    halamanDokter();
  } else {
    alert("Username atau password salah");
  }
}

/* ================= REGISTER DOKTER ================= */
function register() {
  app.innerHTML = `
    <h3>Daftar Akun Dokter</h3>
    <input id="user" placeholder="Username">
    <input id="pw" type="password" placeholder="Password">
    <button onclick="simpanAkun()">Simpan Akun</button>
    <button onclick="loginDokter()">Kembali</button>
  `;
}

function simpanAkun() {
  const user = document.getElementById("user").value.trim();
  const pw = document.getElementById("pw").value.trim();
  let akun = load("akun");

  if (!user || !pw) {
    alert("Semua field wajib diisi");
    return;
  }

  if (akun[user]) {
    alert("Username sudah digunakan");
    return;
  }

  akun[user] = pw;
  save("akun", akun);

  alert("Akun berhasil dibuat");
  loginDokter();
}

/* ================= HALAMAN DOKTER ================= */
function halamanDokter() {
  app.innerHTML = `
    <h3>Input Data Pasien</h3>

    <input id="nama" placeholder="Nama Pasien">
    <input id="poli" placeholder="Poli">
    <input id="gejala" placeholder="Gejala">
    <input id="penanganan" placeholder="Penanganan">
    <input id="obat" placeholder="Obat">
    <input id="kontrol" placeholder="Tanggal Kontrol">

    <div id="qr"></div>

    <button onclick="simpanPasien()">Simpan Data</button>
    <button onclick="welcome()">Logout</button>
  `;
}

function simpanPasien() {
  const nama = document.getElementById("nama").value.trim();
  const poli = document.getElementById("poli").value.trim();
  const gejala = document.getElementById("gejala").value.trim();
  const penanganan = document.getElementById("penanganan").value.trim();
  const obat = document.getElementById("obat").value.trim();
  const kontrol = document.getElementById("kontrol").value.trim();

  if (!nama || !poli || !gejala || !penanganan || !obat || !kontrol) {
    alert("Semua data pasien wajib diisi");
    return;
  }

  let data = load("pasien");

  data[nama] = {
    poli,
    gejala,
    penanganan,
    obat,
    kontrol
  };

  save("pasien", data);

  document.getElementById("qr").innerHTML = "";
  new QRCode("qr", nama);

  alert("Data pasien berhasil disimpan");
}

/* ================= HALAMAN PASIEN ================= */
function halamanPasien() {
  app.innerHTML = `
    <h3>Halaman Pasien</h3>
    <input id="nama" placeholder="Nama Pasien">
    <button onclick="lihatData()">Cari Data</button>

    <div id="reader"></div>
    <button onclick="scanQR()">Scan QR</button>

    <button onclick="welcome()">Kembali</button>
  `;
}

function lihatData() {
  const nama = document.getElementById("nama").value.trim();
  const data = load("pasien")[nama];

  if (!data) {
    alert("Data pasien tidak ditemukan");
    return;
  }

  app.innerHTML = `
    <h3>Data Pasien</h3>
    <p><b>Nama:</b> ${nama}</p>
    <p><b>Poli:</b> ${data.poli}</p>
    <p><b>Gejala:</b> ${data.gejala}</p>
    <p><b>Penanganan:</b> ${data.penanganan}</p>
    <p><b>Obat:</b> ${data.obat}</p>
    <p><b>Tanggal Kontrol:</b> ${data.kontrol}</p>
    <button onclick="welcome()">Selesai</button>
  `;
}

/* ================= SCAN QR ================= */
function scanQR() {
  const qr = new Html5Qrcode("reader");
  qr.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    text => {
      qr.stop();
      tampilkanHasilQR(text);
    }
  );
}

function tampilkanHasilQR(nama) {
  const data = load("pasien")[nama];

  if (!data) {
    alert("Data pasien tidak ditemukan");
    return;
  }

  app.innerHTML = `
    <h3>Data Pasien</h3>
    <p><b>Nama:</b> ${nama}</p>
    <p><b>Poli:</b> ${data.poli}</p>
    <p><b>Gejala:</b> ${data.gejala}</p>
    <p><b>Penanganan:</b> ${data.penanganan}</p>
    <p><b>Obat:</b> ${data.obat}</p>
    <p><b>Tanggal Kontrol:</b> ${data.kontrol}</p>
    <button onclick="welcome()">Selesai</button>
  `;
}

welcome();
