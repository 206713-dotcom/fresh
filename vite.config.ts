import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { createClient } from '@supabase/supabase-js';

// XOR De-obfuscation for Supabase Vault
const VAULT_MASK_KEY = "EcBiz_StudySpace_Supabase_Key_2026";
const MASKED_URL = "LRc2GQllfFsRChE1EQQJBzA8DAQYBBYHAT4hB1csR0BTVCQQJ0cZMA==";
const MASKED_ANON = "IBoIARgYMB06DTMaJRsqVBE6PAMoDDNGBhwCUzA0QmhkdQ9abAwDFSMXRikQHBkrGQEHER0pDCQbKTYWOCwXFV5qW39zKi87Dz4ULh0+LiMZA1Fcajc9HAwGUiEOBhwVEBZbR1tVKFoxMykWZT0YIgwxQlUKKRwZBSk5Mwg8Dxp4Ki0SA312cz8uFiAJFj4iQQc6GkYsCSAoHCExUiwbPh0SJVVXM15SZ1EaDDoqNW44FSZcChdFDQtIJQdEKCkbUkIUby4KLRtrYkZZAywpLA==";

function deobfuscate(b64: string, key = VAULT_MASK_KEY): string {
  try {
    const buf = Buffer.from(b64, "base64");
    let out = "";
    for (let i = 0; i < buf.length; i++) {
      out += String.fromCharCode(buf[i] ^ key.charCodeAt(i % key.length));
    }
    return out;
  } catch {
    return "";
  }
}

function studySpaceApiPlugin(): Plugin {
  return {
    name: 'study-space-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/study-space')) {
          return next();
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || deobfuscate(MASKED_URL);
        const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || deobfuscate(MASKED_ANON);
        const supabase = createClient(supabaseUrl, supabaseAnon);

        res.setHeader('Content-Type', 'application/json; charset=utf-8');

        if (req.method === 'GET') {
          try {
            const url = new URL(req.url, 'http://localhost');
            const code = (url.searchParams.get('code') || url.searchParams.get('access_code') || '').trim().toUpperCase();
            if (!code) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Missing access_code parameter' }));
            }

            const { data, error } = await supabase
              .from('study_sessions')
              .select('access_code, coins, streak, unlocked_themes, updated_at')
              .eq('access_code', code)
              .maybeSingle();

            if (error) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: error.message }));
            }

            if (!data) {
              return res.end(JSON.stringify({
                access_code: code,
                coins: 0,
                streak: 0,
                unlocked_themes: ['default'],
                is_new: true,
              }));
            }

            return res.end(JSON.stringify({
              access_code: data.access_code,
              coins: data.coins ?? 0,
              streak: data.streak ?? 0,
              unlocked_themes: Array.isArray(data.unlocked_themes) ? data.unlocked_themes : ['default'],
              updated_at: data.updated_at,
            }));
          } catch (e: any) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: e?.message || 'Internal Server Error' }));
          }
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              let parsed: any = {};
              try {
                parsed = JSON.parse(body || '{}');
              } catch {
                parsed = {};
              }

              const cleanCode = (parsed.access_code || '').trim().toUpperCase();
              if (!cleanCode) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ error: 'Missing access_code' }));
              }

              const payload = {
                access_code: cleanCode,
                coins: Math.max(0, Math.floor(parsed.coins || 0)),
                streak: Math.max(0, Math.floor(parsed.streak || 0)),
                unlocked_themes: Array.isArray(parsed.unlocked_themes) && parsed.unlocked_themes.length > 0
                  ? parsed.unlocked_themes
                  : ['default'],
                updated_at: new Date().toISOString(),
              };

              const { data, error } = await supabase
                .from('study_sessions')
                .upsert(payload, { onConflict: 'access_code' })
                .select()
                .single();

              if (error) {
                res.statusCode = 500;
                return res.end(JSON.stringify({ error: error.message }));
              }

              return res.end(JSON.stringify({ success: true, data }));
            } catch (e: any) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: e?.message || 'Internal Server Error' }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), studySpaceApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    base: './',
    publicDir: path.resolve(import.meta.dirname || '.', 'subjects/business/public'),
    build: {
      chunkSizeWarningLimit: 8000,
      outDir: 'dist',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
        input: {
          main: path.resolve(import.meta.dirname || '.', 'index.html'),
          business: path.resolve(import.meta.dirname || '.', 'subjects/business/index.html'),
          economics: path.resolve(import.meta.dirname || '.', 'subjects/economics.html'),
          biology: path.resolve(import.meta.dirname || '.', 'subjects/biology.html'),
          chemistry: path.resolve(import.meta.dirname || '.', 'subjects/chemistry.html'),
          computerscience: path.resolve(import.meta.dirname || '.', 'subjects/computer-science.html'),
          englishlanguage: path.resolve(import.meta.dirname || '.', 'subjects/english-language.html'),
          englishliterature: path.resolve(import.meta.dirname || '.', 'subjects/english-literature.html'),
          geography: path.resolve(import.meta.dirname || '.', 'subjects/geography.html'),
          history: path.resolve(import.meta.dirname || '.', 'subjects/history.html'),
          ict: path.resolve(import.meta.dirname || '.', 'subjects/ict.html'),
          mathematics: path.resolve(import.meta.dirname || '.', 'subjects/mathematics.html'),
          physics: path.resolve(import.meta.dirname || '.', 'subjects/physics.html'),
        },
      },
    },
    server: {
      allowedHosts: true as true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      allowedHosts: true as true,
    },
  };
});
