/* ================= FIREBASE IMPORT ================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyBX7yBJtQKU2p4V7x8-kkEvSK14ows4MZY",
  authDomain: "sistem-pasien-b91d7.firebaseapp.com",
  projectId: "sistem-pasien-b91d7",
  storageBucket: "sistem-pasien-b91d7.firebasestorage.app",
  messagingSenderId: "831765150776",
  appId: "1:831765150776:web:c68098b385eb4c25167acd"
};

/* ================= INIT ================= */
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const app = document.getElementById("app");

/* ================= HALAMAN AWAL ================= */
function welcome() {
  app.innerHTML = `
    <h2>Sistem Pasien</h2>
    <p>Pemeriksaan Pasien Online</p>

    <button onclick="loginDokter()">Dokter</button>
    <button class="secondary" onclick="halamanPasien()">Pasien</button>
  `;
}
window.welcome = welcome;

/* ================= LOGIN DOKTER ================= */
function loginDokter() {
  app.innerHTML = `
    <h3>Login Dokter</h3>

    <input id="email" placeholder="Email">
    <input id="pw" type="password" placeholder="Password">

    <button onclick="loginAuth()">Login</button>
    <div class="link" onclick="registerDokter()">Tidak punya akun? Daftar</div>

    <button class="secondary" onclick="welcome()">Kembali</button>
  `;
}
window.loginDokter = loginDokter;

/* ================= REGISTER DOKTER ================= */
function registerDokter() {
  app.innerHTML = `
    <h3>Daftar Dokter</h3>

    <input id="email" placeholder="Email">
    <input id="pw" type="password" placeholder="Password (min 6 karakter)">

    <button onclick="registerAuth()">Daftar</button>
    <button class="secondary" onclick="loginDokter()">Kembali</button>
  `;
}
window.registerDokter = registerDokter;

/* ================= AUTH PROCESS ================= */
async function registerAuth() {
  const email = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;

  try {
    await createUserWithEmailAndPassword(auth, email, pw);
    alert("Akun dokter berhasil dibuat");
    loginDokter();
  } catch (e) {
    alert(e.message);
  }
}
window.registerAuth = registerAuth;

async function loginAuth() {
  const email = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;

  try {
    await signInWithEmailAndPassword(auth, email, pw);
    halamanDokter();
  } catch (e) {
    alert("Login gagal");
  }
}
window.loginAuth = loginAuth;

async function logout() {
  await signOut(auth);
  welcome();
}
window.logout = logout;

/* ================= HALAMAN DOKTER ================= */
function halamanDokter() {
  app.innerHTML = `
    <h3>Input Data Pasien</h3>

    <input id="nama" placeholder="Nama Pasien">
    <input id="poli" placeholder="Poli">
    <input id="gejala" placeholder="Gejala">
    <input id="penanganan" placeholder="Penanganan">
    <input id="obat" placeholder="Obat">
    <input id="kontrol" type="date">

    <button onclick="simpanPasien()">Simpan Data</button>
    <button class="secondary" onclick="logout()">Logout</button>
  `;
}
window.halamanDokter = halamanDokter;

/* ================= SIMPAN PASIEN ================= */
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

  alert("Data pasien berhasil disimpan");
}
window.simpanPasien = simpanPasien;

/* ================= HALAMAN PASIEN ================= */
function halamanPasien() {
  app.innerHTML = `
    <h3>Cek Data Pasien</h3>

    <input id="namaCari" placeholder="Nama Pasien">
    <button onclick="cariPasien()">Cari</button>

    <button class="secondary" onclick="welcome()">Kembali</button>
  `;
}
window.halamanPasien = halamanPasien;

/* ================= CARI PASIEN ================= */
async function cariPasien() {
  const nama = document.getElementById("namaCari").value;
  const ref = doc(db, "pasien", nama);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Data tidak ditemukan");
    return;
  }

  const d = snap.data();
  app.innerHTML = `
    <h3>Data Pasien</h3>
    <div class="card">
      <p><b>Nama:</b> ${nama}</p>
      <p><b>Poli:</b> ${d.poli}</p>
      <p><b>Gejala:</b> ${d.gejala}</p>
      <p><b>Penanganan:</b> ${d.penanganan}</p>
      <p><b>Obat:</b> ${d.obat}</p>
      <p><b>Kontrol:</b> ${d.kontrol}</p>
    </div>

    <button onclick="welcome()">Selesai</button>
  `;
}
window.cariPasien = cariPasien;

/* ================= AUTO LOGIN CHECK ================= */
onAuthStateChanged(auth, user => {
  if (user) {
    halamanDokter();
  } else {
    welcome();
  }
});
