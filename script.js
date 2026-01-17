/* ================= FIREBASE ================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ===== CONFIG KAMU ===== */
const firebaseConfig = {
  apiKey: "AIzaSyBX7yBJtQKU2p4V7x8-kkEvSK14ows4MZY",
  authDomain: "sistem-pasien-b91d7.firebaseapp.com",
  projectId: "sistem-pasien-b91d7",
  storageBucket: "sistem-pasien-b91d7.firebasestorage.app",
  messagingSenderId: "831765150776",
  appId: "1:831765150776:web:c68098b385eb4c25167acd"
};

/* ===== INIT ===== */
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

/* ================= APP ================= */
const app = document.getElementById("app");

/* ================= HALAMAN AWAL ================= */
function welcome() {
  app.innerHTML = `
    <h2>Selamat Datang</h2>
    <p>Sistem Pemeriksaan Pasien (ONLINE)</p>
    <button onclick="loginDokter()">Dokter</button>
    <button onclick="halamanPasien()">Pasien</button>
  `;
}
window.welcome = welcome;

/* ================= LOGIN DOKTER (DUMMY DULU) ================= */
function loginDokter() {
  app.innerHTML = `
    <h3>Login Dokter</h3>
    <input id="user" placeholder="Username">
    <input id="pw" type="password" placeholder="Password">
    <button onclick="halamanDokter()">Login</button>
    <button onclick="welcome()">Kembali</button>
  `;
}
window.loginDokter = loginDokter;

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

    <div id="qr" style="margin:15px"></div>

    <button onclick="simpanPasien()">Simpan</button>
    <button onclick="welcome()">Logout</button>
  `;
}
window.halamanDokter = halamanDokter;

/* ================= SIMPAN PASIEN (ONLINE) ================= */
async function simpanPasien() {
  const nama = document.getElementById("nama").value;
  const poli = document.getElementById("poli").value;
  const gejala = document.getElementById("gejala").value;
  const penanganan = document.getElementById("penanganan").value;
  const obat = document.getElementById("obat").value;
  const kontrol = document.getElementById("kontrol").value;

  if (!nama || !poli || !gejala || !penanganan || !obat || !kontrol) {
    alert("Semua data wajib diisi");
    return;
  }

  await setDoc(doc(db, "pasien", nama), {
    poli,
    gejala,
    penanganan,
    obat,
    kontrol
  });

  document.getElementById("qr").innerHTML = "";
  new QRCode("qr", {
    text: nama,
    width: 150,
    height: 150
  });

  alert("Data pasien tersimpan ONLINE");
}
window.simpanPasien = simpanPasien;

/* ================= HALAMAN PASIEN ================= */
function halamanPasien() {
  app.innerHTML = `
    <h3>Halaman Pasien</h3>

    <input id="namaCari" placeholder="Nama Pasien">
    <button onclick="cariManual()">Cari</button>

    <hr>

    <div id="reader" style="width:300px;margin:auto"></div>
    <button onclick="scanQR()">Scan QR</button>

    <button onclick="welcome()">Kembali</button>
  `;
}
window.halamanPasien = halamanPasien;

/* ================= CARI DATA ================= */
async function bukaDataPasien(nama) {
  const ref = doc(db, "pasien", nama);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Data tidak ditemukan");
    return;
  }

  const d = snap.data();
  app.innerHTML = `
    <h3>Data Pasien</h3>
    <p><b>Nama:</b> ${nama}</p>
    <p><b>Poli:</b> ${d.poli}</p>
    <p><b>Gejala:</b> ${d.gejala}</p>
    <p><b>Penanganan:</b> ${d.penanganan}</p>
    <p><b>Obat:</b> ${d.obat}</p>
    <p><b>Kontrol:</b> ${d.kontrol}</p>
    <button onclick="welcome()">Selesai</button>
  `;
}

window.cariManual = () => {
  const nama = document.getElementById("namaCari").value;
  bukaDataPasien(nama);
};

/* ================= SCAN QR ================= */
window.scanQR = () => {
  const qr = new Html5Qrcode("reader");

  qr.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    text => {
      qr.stop();
      bukaDataPasien(text);
    }
  );
};

/* ================= START ================= */
welcome();
