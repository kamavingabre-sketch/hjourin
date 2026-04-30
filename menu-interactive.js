// ═══════════════════════════════════════════════════════════════
//   MENU INTERACTIVE - Hallo Johor
//   Helper: List Message, Button Message, dan Teks Fallback
//   Support: WhatsApp Business API via OurinGlitch Baileys
// ═══════════════════════════════════════════════════════════════

import { MENU_IMAGE_URL, KATEGORI_PENGADUAN, KELURAHAN_LIST } from './menu.js';
import axios from 'axios';
import logger from './logger.js';

// ─── Delay Helper ────────────────────────────────────────────
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ─── Fetch image buffer dari URL ─────────────────────────────
const fetchImageBuffer = async (url) => {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    return Buffer.from(res.data);
  } catch {
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════
//   DEVICE CAPABILITY DETECTION
//   WhatsApp Interactive Message hanya support di:
//   - WhatsApp Android >= 2.21.x
//   - WhatsApp iOS >= 2.21.x
//   - WhatsApp Web (tidak support list/button native)
//   Deteksi dilakukan via catch error saat send
// ═══════════════════════════════════════════════════════════════

/**
 * Coba kirim pesan interaktif, fallback ke teks jika gagal.
 * @param {object} sock - Baileys socket
 * @param {string} jid - JID tujuan
 * @param {object} interactivePayload - Payload list/button message
 * @param {string} fallbackText - Teks fallback jika device tidak support
 * @param {object} [opts] - Opsi tambahan: {image, imageCaption}
 */
export const sendInteractiveOrFallback = async (sock, jid, interactivePayload, fallbackText, opts = {}) => {
  try {
    await sock.sendMessage(jid, interactivePayload);
    await delay(100);
    return true; // Berhasil kirim interactive
  } catch (err) {
    // Device tidak support list/button → kirim teks biasa
    logger.warn('INTERACTIVE', `Device ${jid} tidak support interactive message, fallback ke teks`, err.message);
    try {
      if (opts.image) {
        await sock.sendMessage(jid, {
          image: opts.image,
          caption: fallbackText || '❓ Ketik *menu* untuk melihat pilihan layanan.',
          mimetype: 'image/jpeg'
        });
      } else {
        await sock.sendMessage(jid, { text: fallbackText || '❓ Ketik *menu* untuk melihat pilihan layanan.' });
      }
      await delay(100);
    } catch (err2) {
      logger.error('SEND', `Gagal kirim fallback teks ke ${jid}`, err2.message);
    }
    return false; // Fallback digunakan
  }
};

// ═══════════════════════════════════════════════════════════════
//   MENU UTAMA — List Message
//   Menggunakan WhatsApp List Message (section + rows)
// ═══════════════════════════════════════════════════════════════

export const buildMenuUtamaListPayload = () => ({
  listMessage: {
    title: '🏛️ HALLO JOHOR — Bot Layanan Kecamatan Medan Johor',
    description: 'Halo! Pilih layanan yang Anda butuhkan:',
    buttonText: '📋 Lihat Layanan',
    footer: '🏙️ Kecamatan Medan Johor • #MEDANUNTUKSEMUA',
    sections: [
      {
        title: '📑 Layanan Administrasi',
        rows: [
          { rowId: '1', title: '📋 Persyaratan Surat', description: 'KTP, KK, Domisili, Usaha, dll' },
          { rowId: '2', title: '📢 Pengaduan Masyarakat', description: 'Laporkan masalah di wilayah Anda' },
          { rowId: '5', title: '📞 Kontak & Jam Pelayanan', description: 'Nomor & alamat kantor kecamatan' },
        ]
      },
      {
        title: '🏘️ Informasi Kecamatan',
        rows: [
          { rowId: '3', title: '📅 Kegiatan Kecamatan', description: 'Jadwal & program kecamatan' },
          { rowId: '7', title: '🌟 Program Unggulan', description: 'RELASI JOHOR, SIGAP JOHOR, UMKM' },
          { rowId: '9', title: '📰 Berita Kecamatan', description: 'Berita terbaru Medan Johor' },
          { rowId: '12', title: '🏪 UMKM Binaan', description: 'Direktori usaha mikro & kecil' },
        ]
      },
      {
        title: '💡 Layanan Khusus',
        rows: [
          { rowId: '4', title: '🏠 Informasi Pajak PBB', description: 'SPPT, cara bayar, lokasi bayar' },
          { rowId: '6', title: '📚 Pintar Johor', description: 'Perpustakaan Interaktif Digital' },
          { rowId: '8', title: '🗺️ Wisata Medan Johor', description: 'Kuliner, Hiburan, Religi & Kesehatan' },
          { rowId: '10', title: '💬 LiveChat Admin', description: 'Chat langsung dengan petugas' },
          { rowId: '11', title: '🔍 Cek Status Laporan', description: 'Lihat riwayat laporan Anda' },
          { rowId: 'iva', title: '🎗️ Skrining IVA', description: 'Deteksi dini kanker serviks (GRATIS)' },
        ]
      }
    ]
  }
});

// Teks fallback untuk menu utama
export const MENU_UTAMA_FALLBACK = `🏛️ *Selamat Datang di*
🤝 *HALLO JOHOR* 🤝
_Bot Layanan Kecamatan Medan Johor_

Halo! Saya siap membantu Anda dengan berbagai layanan administrasi kecamatan.

📋 *MENU LAYANAN:*

1️⃣ *Persyaratan Surat* — KTP, KK, Domisili, dll
2️⃣ *Pengaduan Masyarakat* — Laporkan masalah
3️⃣ *Kegiatan Kecamatan* — Jadwal & program
4️⃣ *Informasi Pajak PBB* — SPPT & cara bayar
5️⃣ *Kontak & Jam Pelayanan* — Info kantor
6️⃣ *Pintar Johor* 📚 — Perpustakaan Digital
7️⃣ *Program Kecamatan* — RELASI, SIGAP, UMKM
8️⃣ *Wisata Medan Johor* — Kuliner & Hiburan
9️⃣ *Berita Kecamatan* — Berita terbaru
🔟 *LiveChat Admin* — Chat langsung petugas
1️⃣1️⃣ *Cek Status Laporan* — Riwayat laporan Anda
1️⃣2️⃣ *UMKM Binaan* 🏪 — Direktori usaha binaan
🎗️ *Ketik IVA* — Skrining Kanker Serviks (GRATIS)

━━━━━━━━━━━━━━━━━━━━━━━
💡 Ketik *angka menu* (1-12) atau *IVA*
━━━━━━━━━━━━━━━━━━━━━━━
🏙️ *#MEDANUNTUKSEMUA*
_Hallo Johor — Hadir untuk Warga Medan Johor_`;

/**
 * Kirim menu utama:
 * 1. Kirim gambar dulu (tanpa caption) — works di semua device
 * 2. Kirim list message (device support) atau teks biasa (fallback)
 */
export const sendMenuUtamaInteractive = async (sock, jid, name) => {
  // Step 1: Kirim gambar header dulu (terpisah dari list/teks)
  try {
    const imgBuffer = await fetchImageBuffer(MENU_IMAGE_URL);
    if (imgBuffer) {
      await sock.sendMessage(jid, {
        image: imgBuffer,
        caption: '🏛️ *HALLO JOHOR* — Bot Layanan Kecamatan Medan Johor',
        mimetype: 'image/jpeg'
      });
      await delay(500);
    }
  } catch (err) {
    logger.warn('MENU', `Gagal kirim gambar menu → ${name}: ${err.message}`);
  }

  // Step 2: Kirim list message, fallback ke teks jika tidak support
  const listPayload = buildMenuUtamaListPayload();
  const success = await sendInteractiveOrFallback(sock, jid, listPayload, MENU_UTAMA_FALLBACK);

  if (success) {
    logger.send(jid, `Menu utama interactive (list) → ${name}`);
  } else {
    logger.warn('MENU', `Fallback teks menu utama → ${name}`);
  }

  await delay(300);
};

// ═══════════════════════════════════════════════════════════════
//   MENU PERSYARATAN SURAT — List Message
// ═══════════════════════════════════════════════════════════════

export const buildPersyaratanListPayload = () => ({
  listMessage: {
    title: '📋 Informasi Persyaratan Surat',
    description: 'Pilih jenis layanan yang Anda butuhkan:',
    buttonText: '📂 Pilih Layanan',
    footer: '🏛️ Kecamatan Medan Johor • Ketik 0 untuk kembali',
    sections: [
      {
        title: '🪪 Layanan Kependudukan',
        rows: [
          { rowId: 'A', title: '🪪 KTP El Baru', description: 'Pembuatan KTP baru pertama kali' },
          { rowId: 'B', title: '🔴 KTP El Hilang', description: 'Penggantian KTP yang hilang' },
          { rowId: 'C', title: '📷 Perekaman KTP El', description: 'Perekaman data KTP elektronik' },
          { rowId: 'D', title: '👨‍👩‍👧 Kartu Keluarga (KK)', description: 'Pembuatan/perubahan KK' },
          { rowId: 'E', title: '👶 KIA', description: 'Kartu Identitas Anak' },
          { rowId: 'F', title: '🚚 Surat Pindah Keluar', description: 'Surat keterangan pindah keluar' },
          { rowId: 'G', title: '🏠 Surat Pindah Masuk', description: 'Surat keterangan pindah masuk' },
        ]
      },
      {
        title: '📝 Surat Keterangan',
        rows: [
          { rowId: 'H', title: '⚖️ Surat Ahli Waris', description: 'Surat pernyataan ahli waris' },
          { rowId: 'J', title: '📍 Domisili Diri', description: 'Surat keterangan domisili diri' },
          { rowId: 'K', title: '🏪 Domisili Usaha', description: 'Surat keterangan domisili usaha' },
          { rowId: 'L', title: '💍 Surat Pengantar Nikah', description: 'Surat pengantar nikah' },
          { rowId: 'M', title: '🕊️ Surat Kematian', description: 'Surat keterangan kematian' },
          { rowId: 'N', title: '👶 Rekomendasi Akte Lahir', description: 'Rekomendasi akte kelahiran' },
          { rowId: 'S', title: '✅ Legalisasi Dokumen', description: 'Legalisasi surat/dokumen' },
        ]
      }
    ]
  }
});

// ═══════════════════════════════════════════════════════════════
//   MENU PENGADUAN — Kategori (Button/List)
// ═══════════════════════════════════════════════════════════════

export const buildKategoriListPayload = () => ({
  listMessage: {
    title: '📢 Pengaduan Masyarakat',
    description: 'Pilih kategori pengaduan yang sesuai:',
    buttonText: '📌 Pilih Kategori',
    footer: '🏛️ Kecamatan Medan Johor • Ketik 0 untuk batal',
    sections: [
      {
        title: '📋 Kategori Pengaduan',
        rows: KATEGORI_PENGADUAN.map(k => ({
          rowId: k.id,
          title: `${k.emoji} ${k.label}`,
          description: `Laporan terkait ${k.label.toLowerCase()}`
        }))
      }
    ]
  }
});

// Fallback teks kategori
export const buildKategoriMenuText = () => {
  let text = `📢 *PENGADUAN MASYARAKAT*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  text += `Pilih *kategori* pengaduan Anda:\n\n`;
  for (const k of KATEGORI_PENGADUAN) {
    text += `${k.emoji} *${k.id}* — ${k.label}\n`;
  }
  text += `\n━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Ketik *angka* kategori (1-${KATEGORI_PENGADUAN.length})\nAtau ketik *0* untuk batal`;
  return text;
};

// ═══════════════════════════════════════════════════════════════
//   MENU KELURAHAN — List Message
// ═══════════════════════════════════════════════════════════════

export const buildKelurahanListPayload = () => ({
  listMessage: {
    title: '🏘️ Pilih Kelurahan',
    description: 'Lokasi kejadian berada di kelurahan mana?',
    buttonText: '🗺️ Pilih Kelurahan',
    footer: '🏛️ Kecamatan Medan Johor • Ketik 0 untuk batal',
    sections: [
      {
        title: '📍 Kelurahan di Kecamatan Medan Johor',
        rows: KELURAHAN_LIST.map(k => ({
          rowId: k.id,
          title: `🏘️ ${k.label}`,
          description: `Pilih jika kejadian di ${k.label}`
        }))
      }
    ]
  }
});

// Fallback teks kelurahan
export const buildKelurahanMenuText = () => {
  let text = `🏘️ *PILIH KELURAHAN*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  text += `Lokasi kejadian berada di kelurahan mana?\n\n`;
  for (const k of KELURAHAN_LIST) {
    text += `*${k.id}* — ${k.label}\n`;
  }
  text += `\n━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `Ketik *angka* kelurahan (1-6)\nAtau ketik *0* untuk batal`;
  return text;
};

// ═══════════════════════════════════════════════════════════════
//   MENU WISATA — Button Message (max 3 button)
//   Untuk submenu wisata W1-W4 pakai list karena >3 item
// ═══════════════════════════════════════════════════════════════

export const buildWisataListPayload = () => ({
  listMessage: {
    title: '🗺️ Wisata Kecamatan Medan Johor',
    description: 'Pilih kategori wisata yang ingin Anda eksplorasi:',
    buttonText: '🌟 Pilih Kategori',
    footer: '🏛️ Kecamatan Medan Johor • Ketik 0 untuk kembali',
    sections: [
      {
        title: '🗺️ Kategori Wisata',
        rows: [
          { rowId: 'W1', title: '🍜 Kuliner Khas Medan Johor', description: 'Tempat makan dan kuliner terbaik' },
          { rowId: 'W2', title: '🎡 Hiburan, Rekreasi & Taman', description: 'Tempat hiburan dan taman kota' },
          { rowId: 'W3', title: '🕌 Wisata Religi', description: 'Tempat ibadah dan wisata religi' },
          { rowId: 'W4', title: '🏥 Fasilitas Kesehatan', description: 'Rumah sakit dan klinik terdekat' },
        ]
      }
    ]
  }
});

// Teks fallback wisata
export const WISATA_FALLBACK_TEXT = `🗺️ *WISATA KECAMATAN MEDAN JOHOR*
━━━━━━━━━━━━━━━━━━━━━━━

Pilih kategori wisata:

🍜 *W1* — Kuliner Khas Medan Johor
🎡 *W2* — Hiburan, Rekreasi & Taman
🕌 *W3* — Wisata Religi
🏥 *W4* — Fasilitas Kesehatan

━━━━━━━━━━━━━━━━━━━━━━━
Ketik *W1 / W2 / W3 / W4* untuk detail
Atau ketik *0* untuk kembali ke menu

🏙️ *#MEDANUNTUKSEMUA*`;

// ═══════════════════════════════════════════════════════════════
//   HANDLER SEND HELPERS
//   sendInteractive* functions — coba kirim list/button,
//   fallback ke teks jika device tidak support
// ═══════════════════════════════════════════════════════════════

/**
 * Kirim menu persyaratan surat (list)
 */
export const sendPersyaratanInteractive = async (sock, jid) => {
  const payload = buildPersyaratanListPayload();
  const fallback = buildPersyaratanFallbackText();
  const success = await sendInteractiveOrFallback(sock, jid, payload, fallback);
  if (!success) logger.warn('MENU', `Fallback persyaratan → ${jid}`);
  else logger.send(jid, 'Menu Persyaratan (list)');
};

// Fallback teks persyaratan (singkat)
const buildPersyaratanFallbackText = () =>
  `📋 *INFORMASI PERSYARATAN SURAT*
━━━━━━━━━━━━━━━━━━━━━━━

🪪 *LAYANAN KEPENDUDUKAN:*
*A* — KTP El Baru  |  *B* — KTP Hilang
*C* — Perekaman KTP  |  *D* — Kartu Keluarga
*E* — KIA  |  *F* — Surat Pindah Keluar
*G* — Surat Pindah Masuk

📝 *SURAT KETERANGAN:*
*H* — Surat Ahli Waris  |  *J* — Domisili Diri
*K* — Domisili Usaha  |  *L* — Pengantar Nikah
*M* — Surat Kematian  |  *N* — Rek. Akte Lahir
*S* — Legalisasi Dokumen

━━━━━━━━━━━━━━━━━━━━━━━
💡 Ketik *kode huruf* (A-N, S) untuk detail
Atau ketik *0* untuk kembali`;

/**
 * Kirim menu kategori pengaduan (list)
 */
export const sendKategoriInteractive = async (sock, jid) => {
  const payload = buildKategoriListPayload();
  const fallback = buildKategoriMenuText();
  const success = await sendInteractiveOrFallback(sock, jid, payload, fallback);
  if (!success) logger.warn('MENU', `Fallback kategori pengaduan → ${jid}`);
  else logger.send(jid, 'Menu Kategori Pengaduan (list)');
};

/**
 * Kirim menu pilih kelurahan (list)
 */
export const sendKelurahanInteractive = async (sock, jid) => {
  const payload = buildKelurahanListPayload();
  const fallback = buildKelurahanMenuText();
  const success = await sendInteractiveOrFallback(sock, jid, payload, fallback);
  if (!success) logger.warn('MENU', `Fallback kelurahan → ${jid}`);
  else logger.send(jid, 'Menu Kelurahan (list)');
};

/**
 * Kirim menu wisata (list)
 */
export const sendWisataInteractive = async (sock, jid) => {
  const payload = buildWisataListPayload();
  const success = await sendInteractiveOrFallback(sock, jid, payload, WISATA_FALLBACK_TEXT);
  if (!success) logger.warn('MENU', `Fallback wisata → ${jid}`);
  else logger.send(jid, 'Menu Wisata (list)');
};

// ═══════════════════════════════════════════════════════════════
//   EXTRACT SELECTION dari list reply / button reply
//   WhatsApp List Reply: msg.listResponseMessage.singleSelectReply.selectedRowId
//   WhatsApp Button Reply: msg.buttonsResponseMessage.selectedButtonId
// ═══════════════════════════════════════════════════════════════

/**
 * Ekstrak ID pilihan dari semua jenis pesan interaktif + teks biasa
 * @param {object} msgContent - msg.message atau actualContent
 * @returns {string|null} selectedId atau null
 */
export const extractInteractiveReply = (msgContent) => {
  if (!msgContent) return null;

  // List message reply
  const listReply = msgContent.listResponseMessage?.singleSelectReply?.selectedRowId;
  if (listReply) return listReply;

  // Button reply (legacy)
  const buttonReply = msgContent.buttonsResponseMessage?.selectedButtonId;
  if (buttonReply) return buttonReply;

  // Interactive/NativeFlow reply
  const interactiveReply = msgContent.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson;
  if (interactiveReply) {
    try {
      const parsed = JSON.parse(interactiveReply);
      return parsed.id || parsed.selectedId || null;
    } catch { return null; }
  }

  // Teks biasa (sudah di-handle oleh caller)
  return null;
};
