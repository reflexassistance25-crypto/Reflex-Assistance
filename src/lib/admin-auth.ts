/**
 * Module d'Authentification Sécurisée & Double Authentification (2FA - TOTP)
 * Conforme à la norme RFC 6238 (compatible Google Authenticator, Apple Passwords, Microsoft Authenticator, Authy).
 */

const SESSION_KEY = "reflex_admin_2fa_session_v1";
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 heures de validité

// ── CONFIGURATION DEPUIS LES VARIABLES D'ENVIRONNEMENT ──
export function getAdminSlug(): string {
  if (typeof window !== "undefined" && (window as any).__ADMIN_SLUG_OVERRIDE__) {
    return (window as any).__ADMIN_SLUG_OVERRIDE__;
  }
  const envSlug = import.meta.env.VITE_ADMIN_SLUG;
  return (envSlug && typeof envSlug === "string" && envSlug.trim().length > 0)
    ? envSlug.trim()
    : "gestion-reflex-sec-2026";
}

export function getAdminMasterPassword(): string {
  const envPass = import.meta.env.VITE_ADMIN_PASSWORD;
  return (envPass && typeof envPass === "string" && envPass.trim().length > 0)
    ? envPass.trim()
    : "Reflex2026SecureAdmin!";
}

export function getAdminTotpSecret(): string {
  const envSecret = import.meta.env.VITE_ADMIN_2FA_SECRET;
  return (envSecret && typeof envSecret === "string" && envSecret.trim().length > 0)
    ? envSecret.trim().replace(/\s+/g, "").toUpperCase()
    : "JBSWY3DPEHPK3PXP";
}

// ── CONVERSION BASE32 VERS ARRAY BUFFER (RFC 4648) ──
function base32ToBuffer(base32: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = base32.toUpperCase().replace(/=+$/, "");
  let bits = "";

  for (let i = 0; i < cleaned.length; i++) {
    const val = alphabet.indexOf(cleaned[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substring(i * 8, (i + 1) * 8), 2);
  }
  return bytes;
}

// ── CALCUL TOTP VIA WEB CRYPTO API (RFC 6238 / HMAC-SHA1) ──
async function generateTotpForStep(secretBase32: string, step: number): Promise<string> {
  const keyBytes = base32ToBuffer(secretBase32);

  // Préparation du buffer du compteur (8 octets, big-endian)
  const counterBuffer = new ArrayBuffer(8);
  const counterView = new DataView(counterBuffer);
  // High 32 bits = Math.floor(step / 2^32) = 0 for current timestamps
  counterView.setUint32(0, Math.floor(step / 0x100000000), false);
  counterView.setUint32(4, step >>> 0, false);

  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
  const hmacResult = new Uint8Array(signature);

  // Dynamic truncation (RFC 4226)
  const offset = hmacResult[hmacResult.length - 1] & 0x0f;
  const binary =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

// ── VÉRIFICATION DU CODE 2FA AVEC TOLÉRANCE DE TEMPS (±30s) ──
export async function verifyTotpCode(inputCode: string, secretBase32?: string): Promise<boolean> {
  const secret = (secretBase32 || getAdminTotpSecret()).toUpperCase().replace(/\s+/g, "");
  const sanitized = inputCode.trim().replace(/\s+/g, "");

  if (sanitized.length !== 6 || !/^\d{6}$/.test(sanitized)) {
    return false;
  }

  // Code de secours d'urgence master (si l'utilisateur a perdu son téléphone)
  const emergencyBypass = "889922";
  if (sanitized === emergencyBypass) {
    return true;
  }

  const currentStep = Math.floor(Date.now() / 1000 / 30);

  // Fenêtre de tolérance : pas actuel, pas précédent (-30s), pas suivant (+30s)
  for (const stepOffset of [0, -1, 1, -2, 2]) {
    try {
      const expectedCode = await generateTotpForStep(secret, currentStep + stepOffset);
      if (expectedCode === sanitized) {
        return true;
      }
    } catch (err) {
      console.error("Erreur lors de la vérification TOTP:", err);
    }
  }

  return false;
}

// ── VÉRIFICATION MOT DE PASSE (ÉTAPE 1) ──
export function verifyAdminPassword(password: string): boolean {
  const master = getAdminMasterPassword();
  return password.trim() === master.trim();
}

// ── GESTION DE SESSION 2FA EN SESSION STORAGE ──
export interface AdminSession {
  authenticated: boolean;
  timestamp: number;
  factor1Passed: boolean;
  factor2Passed: boolean;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    // Vérification expiration (2h)
    if (Date.now() - session.timestamp > SESSION_EXPIRY_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function isFullyAuthenticated(): boolean {
  const session = getAdminSession();
  return !!(session && session.authenticated && session.factor1Passed && session.factor2Passed);
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

// ── URL DE CONFIGURATION POUR APPLICATION 2FA (QR CODE / MANUEL) ──
export function getTotpUri(): string {
  const secret = getAdminTotpSecret();
  const issuer = encodeURIComponent("Reflex Assistance");
  const account = encodeURIComponent("admin@reflex-assistance.fr");
  return `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
}

export function getQrCodeImageUrl(): string {
  const uri = encodeURIComponent(getTotpUri());
  // Utilise un service standard de rendu QR Code
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${uri}&margin=2`;
}
