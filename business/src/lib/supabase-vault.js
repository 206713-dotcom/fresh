// XOR De-obfuscation Utility for Supabase Configuration

const VAULT_MASK_KEY = "EcBiz_StudySpace_Supabase_Key_2026";

// Obfuscated payload strings (XOR masked + base64 encoded)
const MASKED_CONFIG = {
  // Obfuscated: "https://dnhfaejbooytyfwtdajb.supabase.co"
  url: "LRc2GQllfFsRChE1EQQJBzA8DAQYBBYHAT4hB1csR0BTVCQQJ0cZMA==",
  // Obfuscated: Anon JWT key
  anonKey: "IBoIARgYMB06DTMaJRsqVBE6PAMoDDNGBhwCUzA0QmhkdQ9abAwDFSMXRikQHBkrGQEHER0pDCQbKTYWOCwXFV5qW39zKi87Dz4ULh0+LiMZA1Fcajc9HAwGUiEOBhwVEBZbR1tVKFoxMykWZT0YIgwxQlUKKRwZBSk5Mwg8Dxp4Ki0SA312cz8uFiAJFj4iQQc6GkYsCSAoHCExUiwbPh0SJVVXM15SZ1EaDDoqNW44FSZcChdFDQtIJQdEKCkbUkIUby4KLRtrYkZZAywpLA==",
  // Obfuscated: Publishable key
  publishableKey: "NgEdGQ89Px0GDBgxHAQ8JmYhWEFUKiQGUSgyBApuZUF6YCpUAzYpOjpAAxI0IA=="
};

/**
 * Universal XOR decoder that works in both Node.js server runtimes and browser environments.
 */
export function deobfuscateString(b64Encoded, maskKey = VAULT_MASK_KEY) {
  try {
    let binaryStr = "";
    if (typeof Buffer !== "undefined") {
      const buf = Buffer.from(b64Encoded, "base64");
      for (let i = 0; i < buf.length; i++) {
        binaryStr += String.fromCharCode(buf[i] ^ maskKey.charCodeAt(i % maskKey.length));
      }
      return binaryStr;
    } else if (typeof atob === "function") {
      const raw = atob(b64Encoded);
      for (let i = 0; i < raw.length; i++) {
        binaryStr += String.fromCharCode(raw.charCodeAt(i) ^ maskKey.charCodeAt(i % maskKey.length));
      }
      return binaryStr;
    }
    return "";
  } catch (err) {
    console.error("XOR deobfuscation failed:", err);
    return "";
  }
}

/**
 * Returns the resolved Supabase URL and Anon key, prioritizing process.env
 * and falling back to the XOR-obfuscated embedded vault.
 */
export function getResolvedSupabaseCredentials() {
  const envUrl = typeof process !== "undefined" && process.env ? (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) : null;
  const envAnon = typeof process !== "undefined" && process.env ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) : null;

  const url = envUrl || deobfuscateString(MASKED_CONFIG.url);
  const anonKey = envAnon || deobfuscateString(MASKED_CONFIG.anonKey);
  const publishableKey = deobfuscateString(MASKED_CONFIG.publishableKey);

  return {
    url,
    anonKey,
    publishableKey
  };
}
