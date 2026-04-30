# 🚀 Panduan Update Hallo Johor Bot

## Perubahan yang Dilakukan

### 1. Custom Pairing Code `HALL-OJHR`
Bot menggunakan **OurinGlitch Baileys** yang support custom pairing code.
Kode pairing akan selalu tampil sebagai **`HALL-OJHR`** — tidak acak lagi.

### 2. Menu Interaktif (List Message + Fallback Otomatis)
Menu utama, persyaratan surat, pengaduan, kelurahan, dan wisata sekarang menggunakan
**WhatsApp List Message** — tampil sebagai tombol interaktif yang bisa ditap.

Untuk device yang tidak support, bot otomatis **fallback ke teks biasa** — tidak error.

---

## Struktur File Baru/Berubah

```
hallojohor/
├── .npmrc                ← BARU: force legacy-peer-deps untuk npm install
├── baileys/
│   └── index.js          ← ESM wrapper untuk OurinGlitch
├── baileys-src/          ← OurinGlitch Baileys (source CJS)
├── menu-interactive.js   ← BARU: helpers list/button message + fallback
├── handler.js            ← DIUPDATE: pakai interactive menu
├── index.js              ← DIUPDATE: custom pairing code HALL-OJHR
└── package.json          ← DIUPDATE: termasuk deps OurinGlitch + libsignal alias
```

---

## Cara Deploy

### Lokal
```bash
# 1. Install (cukup sekali, .npmrc sudah handle --legacy-peer-deps)
npm install

# 2. Hapus auth lama (WAJIB karena ganti library Baileys)
rm -rf auth_info_baileys

# 3. Jalankan
npm start
```

### Railway
Cukup push — Railway akan `npm install` otomatis.
File `.npmrc` sudah memastikan `legacy-peer-deps=true`.

**Wajib set env var:**
| Variable | Nilai |
|----------|-------|
| `PHONE_NUMBER` | `628xxxxxxxxxx` |

---

## Login dengan Pairing Code HALL-OJHR

Saat terminal menampilkan:
```
╔══════════════════════════════╗
║   🔑  PAIRING CODE ANDA      ║
║                              ║
║      HALL-OJHR               ║
║                              ║
╚══════════════════════════════╝
```

1. Buka WhatsApp → 3 titik → **Perangkat Tertaut**
2. Tap **"Tautkan Perangkat"**
3. Masukkan kode: **`HALL-OJHR`**

> ⚠️ Hapus folder `auth_info_baileys` dulu sebelum jalankan jika sebelumnya sudah pernah login!

---

## Menu Interaktif — Cara Kerja

| Menu | Tipe |
|------|------|
| Menu Utama | List Message (3 section, 13 pilihan) |
| Persyaratan Surat | List Message (2 section, 14 pilihan) |
| Kategori Pengaduan | List Message (8 kategori) |
| Pilih Kelurahan | List Message (6 kelurahan) |
| Wisata Medan Johor | List Message (4 kategori) |

**Fallback otomatis:** Jika device tidak support list message (WA lama / WA Web),
bot kirim teks biasa secara otomatis — tidak perlu konfigurasi apapun.

---

## Troubleshooting

### Error `Cannot find module 'libsignal'`
Pastikan `npm install` sudah dijalankan dari root project (bukan dari `baileys-src/`).
Package `libsignal` sudah di-alias ke `@otaxayun/libsignal-node` di `package.json`.

### List menu tidak tampil di HP
Update WhatsApp ke versi terbaru. Bot akan fallback ke teks jika tidak support.

### Pairing code bukan HALL-OJHR
Hapus `auth_info_baileys` dan restart bot.
