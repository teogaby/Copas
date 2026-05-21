/**
 * api/results.js  –  Vercel Serverless Function (Node.js)
 * GET /api/results  →  devuelve resultados desde Blob (público, sin auth)
 */

import { list } from '@vercel/blob';

const BLOB_NAME = 'copa-results.json';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store');

  try {
    const { blobs } = await list({ prefix: BLOB_NAME });
    if (!blobs.length) {
      return res.status(200).json({ results: [], updatedAt: new Date().toISOString() });
    }
    const r = await fetch(blobs[0].url);
    const results = r.ok ? await r.json() : [];
    return res.status(200).json({ results, updatedAt: new Date().toISOString() });
  } catch (e) {
    // Blob not configured yet — return empty gracefully
    return res.status(200).json({ results: [], updatedAt: new Date().toISOString() });
  }
}
