import { createClient } from '@libsql/client/web';

const TURSO_STORAGE_KEY = 'al_kitabah_turso_config';

export function getStoredTursoConfig() {
  try {
    const custom = localStorage.getItem(TURSO_STORAGE_KEY);
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.warn('Failed to read Turso config from storage', e);
  }

  const envUrl = import.meta.env.VITE_TURSO_DATABASE_URL;
  const envToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

  if (envUrl && envToken) {
    return {
      url: envUrl,
      authToken: envToken
    };
  }

  return null;
}

export function saveStoredTursoConfig(config) {
  try {
    if (!config) {
      localStorage.removeItem(TURSO_STORAGE_KEY);
    } else {
      localStorage.setItem(TURSO_STORAGE_KEY, JSON.stringify(config));
    }
    initTurso();
  } catch (e) {
    console.error('Failed to save Turso config', e);
  }
}

let tursoClient = null;

export function initTurso() {
  const config = getStoredTursoConfig();
  if (!config || !config.url || !config.authToken) {
    tursoClient = null;
    return null;
  }

  let formattedUrl = config.url.trim();
  // Ensure url uses https:// or libsql:// format supported by client/web
  if (formattedUrl.startsWith('libsql://')) {
    formattedUrl = formattedUrl.replace('libsql://', 'https://');
  } else if (!formattedUrl.startsWith('https://') && !formattedUrl.startsWith('http://')) {
    formattedUrl = `https://${formattedUrl}`;
  }

  try {
    tursoClient = createClient({
      url: formattedUrl,
      authToken: config.authToken.trim()
    });
    return tursoClient;
  } catch (err) {
    console.warn('Turso client creation failed:', err);
    tursoClient = null;
    return null;
  }
}

export function getTursoClient() {
  if (!tursoClient) {
    return initTurso();
  }
  return tursoClient;
}

export function isTursoConnected() {
  return getTursoClient() !== null;
}

// Ensure templates table exists
export async function ensureTursoTable() {
  const client = getTursoClient();
  if (!client) return false;

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        watermark TEXT,
        updated_at INTEGER
      );
    `);
    return true;
  } catch (err) {
    console.error('Failed to create Turso templates table:', err);
    return false;
  }
}

// Fetch all templates from Turso
export async function fetchTursoTemplates() {
  const client = getTursoClient();
  if (!client) return [];

  try {
    await ensureTursoTable();
    const result = await client.execute('SELECT * FROM templates ORDER BY updated_at DESC');
    return result.rows.map(row => ({
      id: String(row.id),
      title: String(row.title || ''),
      category: String(row.category || 'Official'),
      description: String(row.description || ''),
      content: String(row.content || ''),
      watermark: String(row.watermark || '')
    }));
  } catch (err) {
    console.error('Failed to fetch templates from Turso:', err);
    return [];
  }
}

// Save / Upsert Template in Turso
export async function saveTursoTemplate(template) {
  const client = getTursoClient();
  if (!client) throw new Error('Turso Database is not configured');

  await ensureTursoTable();

  const id = template.id || 'tpl_' + Date.now();
  const title = template.title || 'Untitled';
  const category = template.category || 'Official';
  const description = template.description || '';
  const content = template.content || '';
  const watermark = template.watermark || '';
  const updatedAt = Date.now();

  await client.execute({
    sql: `
      INSERT INTO templates (id, title, category, description, content, watermark, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        category = excluded.category,
        description = excluded.description,
        content = excluded.content,
        watermark = excluded.watermark,
        updated_at = excluded.updated_at;
    `,
    args: [id, title, category, description, content, watermark, updatedAt]
  });

  return { id, title, category, description, content, watermark };
}

// Delete Template from Turso
export async function deleteTursoTemplate(templateId) {
  const client = getTursoClient();
  if (!client) throw new Error('Turso Database is not configured');

  await client.execute({
    sql: 'DELETE FROM templates WHERE id = ?',
    args: [templateId]
  });
}

// Test Turso Connection
export async function testTursoConnection(url, authToken) {
  if (!url || !authToken) throw new Error('Both URL and Auth Token are required');
  let formattedUrl = url.trim();
  if (formattedUrl.startsWith('libsql://')) {
    formattedUrl = formattedUrl.replace('libsql://', 'https://');
  } else if (!formattedUrl.startsWith('https://') && !formattedUrl.startsWith('http://')) {
    formattedUrl = `https://${formattedUrl}`;
  }

  const client = createClient({
    url: formattedUrl,
    authToken: authToken.trim()
  });

  await client.execute('SELECT 1 as test');
  return true;
}
