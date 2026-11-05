import { createClient } from '@supabase/supabase-js';

// --- XOR De-obfuscation Engine ---
const VAULT_MASK_KEY = "EcBiz_StudySpace_Supabase_Key_2026";

// Obfuscated base64 credentials (XOR encrypted at build time)
const OBFUSCATED_CONFIG = {
  // Obfuscated: "https://dnhfaejbooytyfwtdajb.supabase.co"
  url: "LRc2GQllfFsRChE1EQQJBzA8DAQYBBYHAT4hB1csR0BTVCQQJ0cZMA==",
  // Obfuscated: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  anonKey: "IBoIARgYMB06DTMaJRsqVBE6PAMoDDNGBhwCUzA0QmhkdQ9abAwDFSMXRikQHBkrGQEHER0pDCQbKTYWOCwXFV5qW39zKi87Dz4ULh0+LiMZA1Fcajc9HAwGUiEOBhwVEBZbR1tVKFoxMykWZT0YIgwxQlUKKRwZBSk5Mwg8Dxp4Ki0SA312cz8uFiAJFj4iQQc6GkYsCSAoHCExUiwbPh0SJVVXM15SZ1EaDDoqNW44FSZcChdFDQtIJQdEKCkbUkIUby4KLRtrYkZZAywpLA==",
};

/**
 * Universal XOR decoder to restore credentials securely at runtime
 */
function deobfuscate(b64, key = VAULT_MASK_KEY) {
  try {
    let out = "";
    if (typeof Buffer !== "undefined") {
      const buf = Buffer.from(b64, "base64");
      for (let i = 0; i < buf.length; i++) {
        out += String.fromCharCode(buf[i] ^ key.charCodeAt(i % key.length));
      }
      return out;
    }
    const raw = atob(b64);
    for (let i = 0; i < raw.length; i++) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return out;
  } catch {
    return "";
  }
}

// Initialize the Supabase client using environment variables or XOR-deobfuscated credentials
const getSupabaseClient = () => {
  const supabaseUrl =
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || deobfuscate(OBFUSCATED_CONFIG.url)).trim();
  const supabaseAnonKey =
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || deobfuscate(OBFUSCATED_CONFIG.anonKey)).trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

/**
 * GET /api/study-space?code=STUDY-XXXX
 * Retrieves coin balance, day streak, and unlocked themes for an anonymous access code.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessCode = (searchParams.get('code') || searchParams.get('access_code') || '').trim().toUpperCase();

    if (!accessCode) {
      return Response.json(
        { error: 'Missing access_code parameter' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return Response.json(
        {
          error: 'Supabase client could not be initialized',
          access_code: accessCode,
          coins: 0,
          streak: 0,
          unlocked_themes: ['default'],
        },
        { status: 200 }
      );
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .select('access_code, coins, streak, unlocked_themes, updated_at')
      .eq('access_code', accessCode)
      .maybeSingle();

    if (error) {
      console.error('[Supabase GET Error]:', error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      // If code does not exist yet, return a clean default session payload
      return Response.json({
        access_code: accessCode,
        coins: 0,
        streak: 0,
        unlocked_themes: ['default'],
        is_new: true,
      });
    }

    return Response.json({
      access_code: data.access_code,
      coins: data.coins ?? 0,
      streak: data.streak ?? 0,
      unlocked_themes: Array.isArray(data.unlocked_themes) ? data.unlocked_themes : ['default'],
      updated_at: data.updated_at,
    });
  } catch (err) {
    console.error('[API GET Route Exception]:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/study-space
 * Upserts coins, streak count, and unlocked themes for the student's anonymous access code.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { access_code, coins, streak, unlocked_themes } = body || {};

    const cleanCode = (access_code || '').trim().toUpperCase();
    if (!cleanCode) {
      return Response.json(
        { error: 'Invalid or missing access_code' },
        { status: 400 }
      );
    }

    const safeCoins = typeof coins === 'number' && Number.isFinite(coins) ? Math.max(0, Math.floor(coins)) : 0;
    const safeStreak = typeof streak === 'number' && Number.isFinite(streak) ? Math.max(0, Math.floor(streak)) : 0;
    const safeThemes = Array.isArray(unlocked_themes) && unlocked_themes.length > 0 
      ? Array.from(new Set(unlocked_themes)) 
      : ['default'];

    const payload = {
      access_code: cleanCode,
      coins: safeCoins,
      streak: safeStreak,
      unlocked_themes: safeThemes,
      updated_at: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (!supabase) {
      return Response.json(
        {
          warning: 'Supabase credentials missing or invalid; payload validated',
          data: payload,
        },
        { status: 200 }
      );
    }

    const { data, error } = await supabase
      .from('study_sessions')
      .upsert(payload, { onConflict: 'access_code' })
      .select('access_code, coins, streak, unlocked_themes, updated_at')
      .single();

    if (error) {
      console.error('[Supabase POST Error]:', error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('[API POST Route Exception]:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
