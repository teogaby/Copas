/**
 * api/save.js  –  Vercel Serverless Function (Node.js)
 * GET    /api/save          → devuelve resultados (público)
 * GET    /api/save?auth=1   → verifica contraseña (requiere header x-admin-password)
 * POST   /api/save          → guarda resultado (requiere contraseña)
 * DELETE /api/save          → elimina resultado por id (requiere contraseña)
 */

import { put, list } from '@vercel/blob';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'copa2026';
const BLOB_NAME      = 'copa-results.json';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function readResults() {
  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function writeResults(results) {
  await put(BLOB_NAME, JSON.stringify(results), {
    access:          'public',
    addRandomSuffix: false,
    contentType:     'application/json',
  });
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');
  res.setHeader('Cache-Control', 'no-cache, no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET ?auth=1 – verificar contraseña admin ────────────────────────────
  // Parse query string manually (safe for all Vercel runtimes)
  const reqUrl = new URL(req.url, 'http://localhost');
  const isAuth = reqUrl.searchParams.get('auth') === '1';

  if (req.method === 'GET' && isAuth) {
    const pwd = req.headers['x-admin-password'];
    if (pwd === ADMIN_PASSWORD) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  }

  // ── GET – lectura pública de resultados ─────────────────────────────────
  if (req.method === 'GET') {
    const results = await readResults();
    return res.status(200).json({ results });
  }

  // ── Auth check para escritura ────────────────────────────────────────────
  const pwd = req.headers['x-admin-password'];
  if (pwd !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  // ── POST – guardar resultado ─────────────────────────────────────────────
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { fase, fecha, campo, local, visitante, gl, gv } = body;

      if (!local || !visitante || gl === undefined || gv === undefined) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const results   = await readResults();
      const newResult = {
        id:        Date.now(),
        fase:      fase      || '',
        fecha:     fecha     || '',
        campo:     campo     || '—',
        local,
        visitante,
        gl:        parseInt(gl),
        gv:        parseInt(gv),
        addedAt:   new Date().toISOString(),
      };
      results.push(newResult);
      await writeResults(results);
      return res.status(200).json({ ok: true, result: newResult });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── DELETE – eliminar resultado por id ───────────────────────────────────
  if (req.method === 'DELETE') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id } = body;
      let results = await readResults();
      results = results.filter(r => r.id !== id);
      await writeResults(results);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
