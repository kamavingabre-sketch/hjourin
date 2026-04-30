// ESM wrapper untuk OurinGlitch-Baileys (CommonJS)
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const baileys = require(join(__dirname, '../baileys-src/lib/index.js'));

// Re-export semua yang dibutuhkan
export default baileys.default || baileys.makeWASocket;
export const makeWASocket = baileys.makeWASocket || baileys.default;
export const useMultiFileAuthState = baileys.useMultiFileAuthState;
export const DisconnectReason = baileys.DisconnectReason;
export const fetchLatestBaileysVersion = baileys.fetchLatestBaileysVersion;
export const makeCacheableSignalKeyStore = baileys.makeCacheableSignalKeyStore;
export const Browsers = baileys.Browsers;
export const downloadMediaMessage = baileys.downloadMediaMessage;
export const getContentType = baileys.getContentType;
export const jidNormalizedUser = baileys.jidNormalizedUser;
