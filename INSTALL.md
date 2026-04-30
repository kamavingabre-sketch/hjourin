# 🚀 Panduan Update Hallo Johor Bot

## Perubahan yang Dilakukan

### 1. Custom Pairing Code `HALL-OJHR`
Bot sekarang menggunakan **OurinGlitch Baileys** yang support custom pairing code.
Saat login pertama kali, kode pairing akan selalu tampil sebagai **`HALL-OJHR`** — tidak acak lagi.

### 2. Menu Interaktif (List Message + Fallback)
Menu utama, persyaratan surat, pengaduan, kelurahan, dan wisata sekarang menggunakan
**WhatsApp List Message** — tampil sebagai tombol interaktif yang bisa ditap.

Untuk device yang tidak support (WhatsApp versi lama / WhatsApp Web), bot akan otomatis
**fallback ke teks biasa** — tidak ada error, pengguna tetap bisa menggunakan bot.

---

## Struktur File Baru

```
hallojohor/
├── baileys/              ← ESM wrapper untuk OurinGlitch
│   └── index.js
├── baileys-src/          ← OurinGlitch Baileys (source)
│   ├── lib/
│   ├── WAProto/
│   └── package.json
├── menu-interactive.js   ← File BARU: helpers list/button message
├── handler.js            ← DIUPDATE: pakai interactive menu
├── index.js              ← DIUPDATE: custom pairing code
└── package.json          ← DIUPDATE: deps OurinGlitch
```

---

## Cara Instalasi

### Step 1 — Install Dependencies Utama
```bash
npm install
```

### Step 2 — Install Dependencies OurinGlitch Baileys
```bash
cd baileys-src
npm install --legacy-peer-deps
cd ..
```

### Step 3 — Hapus Auth Lama (Wajib!)
```bash
rm -rf auth_info_baileys
```
> ⚠️ Wajib hapus auth lama karena ganti library Baileys.
> Bot perlu login ulang dengan pairing code **HALL-OJHR**.

### Step 4 — Jalankan Bot
```bash
npm start
# atau
node index.js
```

### Step 5 — Login dengan Pairing Code
Saat terminal menampilkan:
```
╔══════════════════════════════╗
║   🔑  PAIRING CODE ANDA      ║
║                              ║
║      HALL-OJHR               ║
║                              ║
╚══════════════════════════════╝
```

1. Buka WhatsApp di HP
2. Tap 3 titik → **Perangkat Tertaut**
3. Tap **"Tautkan Perangkat"**
4. Masukkan kode: **`HALL-OJHR`**

---

## Deploy ke Railway

### Tambah Environment Variables
| Variable | Nilai |
|----------|-------|
| `PHONE_NUMBER` | `628xxxxxxxxxx` |

### Jalankan install script di Railway
Tambahkan di `railway.toml` atau custom build command:
```toml
[build]
builder = "nixpacks"

[build.nixpacksPlan.phases.setup]
cmds = ["npm install", "cd baileys-src && npm install --legacy-peer-deps && cd .."]
```

---

## Cara Kerja Menu Interaktif

### List Message (Support)
Pengguna dengan WhatsApp versi terbaru akan melihat:
- Tombol **"📋 Lihat Layanan"** → klik → muncul daftar menu interaktif
- Bisa pilih dengan tap, tidak perlu ketik angka

### Teks Fallback (Tidak Support)
Pengguna dengan WhatsApp lama / WhatsApp Web akan menerima:
- Teks menu biasa dengan format angka 1-12
- Tetap bisa menggunakan semua fitur bot

### Menu yang Sudah Interaktif
| Menu | Tipe |
|------|------|
| Menu Utama | List Message (3 section) |
| Persyaratan Surat | List Message (2 section) |
| Kategori Pengaduan | List Message |
| Pilih Kelurahan | List Message |
| Wisata Medan Johor | List Message |

---

## Troubleshooting

### Error `Cannot find module './baileys/index.js'`
```bash
ls baileys-src/lib/index.js  # Pastikan file ada
```

### Error `chalk` atau module lain tidak ditemukan
```bash
cd baileys-src
npm install --legacy-peer-deps
```

### Pairing code tidak muncul `HALL-OJHR`
Pastikan auth lama sudah dihapus:
```bash
rm -rf auth_info_baileys
```

### List message tidak muncul di HP
- Update WhatsApp ke versi terbaru
- Bot akan otomatis fallback ke teks biasa jika tidak support
