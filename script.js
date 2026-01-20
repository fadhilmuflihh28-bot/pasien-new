const app = document.getElementById("app");

/* ========= CONFIG ========= */
const LOGIN_API = "https://script.google.com/macros/s/AKfycbzrxWvctnslXDiYZuAC-yrEytrchHlnY_oerjcvodlTkpIgFO5sImdBmKgv4iFtrRaLzQ/exec";

/* ========= STORAGE (PASlEN LOKAL) ========= */
const save = (k,d)=>localStorage.setItem(k,JSON.stringify(d));
const load = k => JSON.parse(localStorage.getItem(k)) || {};

/* ========= HOME ========= */
function welcome(){
  app.innerHTML=`
    <h2>Selamat Datang 👋</h2>
    <p style="text-align:center">Sistem Pemeriksaan Pasien</p>
    <button onclick="loginDokter()">Dokter</button>
    <button onclick="halamanPasien()">Pasien</button>
  `;
}

/* ========= LOGIN DOKTER (API ONLY) ========= */
function loginDokter(){
  app.innerHTML=`
    <h3>Login Dokter</h3>
    <input id="user" placeholder="Username">
    <input id="pw" type="password" placeholder="Password">
    <button onclick="cekLogin()">Login</button>
    <button class="secondary" onclick="welcome()">Kembali</button>
  `;
}

function cekLogin(){
  const u = document.getElementById("user").value.trim();
  const p = document.getElementById("pw").value.trim();

  if(!u || !p) return alert("Username & password wajib diisi");

  fetch(LOGIN_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "login",
      username: u,
      password: p
    })
  })
  .then(r => r.json())
  .then(d => {
    if(d.status === "success"){
      halamanDokter();
    } else {
      alert(d.message || "Login gagal");
    }
  })
  .catch(() => alert("Gagal koneksi ke server"));
}

/* ========= DOKTER ========= */
function halamanDokter(editNama=null){
  const p = editNama ? load("pasien")[editNama] : {};
  app.innerHTML=`
    <h3>${editNama?"Edit":"Input"} Pasien</h3>
    <input id="nama" placeholder="Nama" value="${editNama||""}" ${editNama?"disabled":""}>
    <input id="poli" placeholder="Poli" value="${p?.poli||""}">
    <input id="gejala" placeholder="Gejala" value="${p?.gejala||""}">
    <input id="penanganan" placeholder="Penanganan" value="${p?.penanganan||""}">
    <input id="obat" placeholder="Obat" value="${p?.obat||""}">
    <input id="kontrol" placeholder="Tanggal Kontrol" value="${p?.kontrol||""}">
    <div id="qr"></div>
    <button onclick="simpanPasien('${editNama||""}')">Simpan</button>
    <button class="secondary" onclick="welcome()">Logout</button>
  `;
}

function simpanPasien(old){
  const f=["nama","poli","gejala","penanganan","obat","kontrol"];
  for(let i of f) if(!document.getElementById(i).value) 
    return alert("Lengkapi semua data");

  let data = load("pasien");
  const nama = old || document.getElementById("nama").value;

  data[nama] = {
    poli: poli.value,
    gejala: gejala.value,
    penanganan: penanganan.value,
    obat: obat.value,
    kontrol: kontrol.value
  };

  save("pasien", data);

  document.getElementById("qr").innerHTML="";
  new QRCode("qr", nama);

  alert("Data pasien tersimpan");
}

/* ========= PASIEN ========= */
function halamanPasien(){
  app.innerHTML=`
    <h3>Pasien</h3>
    <input id="nama" placeholder="Nama Pasien">
    <button onclick="lihatData()">Cari</button>
    <div id="reader"></div>
    <button onclick="scanQR()">Scan QR</button>
    <button class="secondary" onclick="welcome()">Kembali</button>
  `;
}

function lihatData(){
  const n = nama.value;
  const d = load("pasien")[n];
  if(!d) return alert("Data tidak ditemukan");

  app.innerHTML=`
    <h3>Data Pasien</h3>
    <p>Nama: ${n}</p>
    <p>Poli: ${d.poli}</p>
    <p>Gejala: ${d.gejala}</p>
    <p>Penanganan: ${d.penanganan}</p>
    <p>Obat: ${d.obat}</p>
    <p>Kontrol: ${d.kontrol}</p>
    <button onclick="halamanDokter('${n}')">Edit</button>
    <button class="danger" onclick="hapus('${n}')">Hapus</button>
    <button onclick="exportPDF('${n}')">Export PDF</button>
    <button class="secondary" onclick="welcome()">Selesai</button>
  `;
}

function hapus(n){
  if(!confirm("Yakin hapus data pasien?")) return;
  let d = load("pasien");
  delete d[n];
  save("pasien", d);
  welcome();
}

/* ========= QR ========= */
function scanQR(){
  const q = new Html5Qrcode("reader");
  q.start(
    {facingMode:"environment"},
    {fps:10, qrbox:250},
    t => { q.stop(); nama.value=t; lihatData(); }
  );
}

/* ========= PDF ========= */
function exportPDF(n){
  const d = load("pasien")[n];
  const w = window.open("");
  w.document.write(`<pre>
DATA PASIEN
Nama: ${n}
Poli: ${d.poli}
Gejala: ${d.gejala}
Penanganan: ${d.penanganan}
Obat: ${d.obat}
Kontrol: ${d.kontrol}
</pre>`);
  w.print();
}

/* ========= START ========= */
welcome();
