// database.ts
import { open } from 'react-native-quick-sqlite';

const DB_NAME = 'plantcare.db';
let db: any = null;

/* ---------- Types (public-facing) ---------- */

export interface Plant {
  id: string;
  name: string;
  species: string;
  added_date: string;
  last_watered_date: string | null;
  watering_frequency: number;
  image_thumb: string | null;
  notes: string;
  sync_status: number;
}

export interface WateringHistory {
  id: string;
  plant_id: string;
  watered_date: string;
  notes: string;
}

export interface Moment {
  id: string;
  plant_id: string;
  image: string;
  caption: string;
  date: string;
}

export interface Goal {
  id: string;
  plant_id: string;
  title: string;
  description: string;
  target_date: string;
  completed: number;
}

export interface PlantNote {
  id: string;
  plant_id: string;
  note: string;
  date: string;
}

/* ---------- DB helpers ---------- */

/**
 * Ensure DB opened and return instance.
 */
export const openDB = async (): Promise<any> => {
  if (db) return db;
  try {
    console.log('[SQLite] Opening database...');
    db = open({ name: DB_NAME });
    console.log('[SQLite] Database opened');
    return db;
  } catch (error) {
    console.error('[SQLite] Error opening database:', error);
    throw error;
  }
};

/* ---------- Initialization ---------- */

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('[SQLite] Initializing database...');
    const database = await openDB();
    database.execute(
      `CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        added_date TEXT NOT NULL,
        last_watered_date TEXT,
        watering_frequency INTEGER NOT NULL,
        image_thumb TEXT,
        notes TEXT,
        last_sync_date TEXT NOT NULL,
        sync_status INTEGER DEFAULT 0
      );`
    );
    database.execute(
      `CREATE TABLE IF NOT EXISTS watering_history (
        id TEXT PRIMARY KEY,
        plant_id TEXT NOT NULL,
        watered_date TEXT NOT NULL,
        notes TEXT,
        sync_status INTEGER DEFAULT 0
      );`
    );
    database.execute(
      `CREATE TABLE IF NOT EXISTS moments (
        id TEXT PRIMARY KEY,
        plant_id TEXT NOT NULL,
        image TEXT NOT NULL,
        caption TEXT,
        date TEXT NOT NULL,
        sync_status INTEGER DEFAULT 0
      );`
    );
    database.execute(
      `CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        plant_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        target_date TEXT,
        completed INTEGER DEFAULT 0,
        sync_status INTEGER DEFAULT 0
      );`
    );
    database.execute(
      `CREATE TABLE IF NOT EXISTS plant_notes (
        id TEXT PRIMARY KEY,
        plant_id TEXT NOT NULL,
        note TEXT NOT NULL,
        date TEXT NOT NULL,
        sync_status INTEGER DEFAULT 0
      );`
    );
    console.log('[SQLite] Database initialized');
  } catch (error) {
    console.error('[SQLite] Error initializing database:', error);
    throw error;
  }
};

/* ---------- Plants ---------- */

export const addPlant = async (plant: Omit<Plant, 'id'>): Promise<Plant> => {
  const database = await openDB();
  const id = Date.now().toString();
  try {
    console.log('[SQLite] Adding plant:', plant);
    database.execute(
      `INSERT INTO plants (id, name, species, added_date, last_watered_date, watering_frequency, image_thumb, notes, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, plant.name, plant.species, plant.added_date, plant.last_watered_date, plant.watering_frequency, plant.image_thumb, plant.notes, 1]
    );
    console.log('[SQLite] Plant added:', id);
    return { id, ...plant };
  } catch (error) {
    console.error('[SQLite] Error adding plant:', error);
    throw error;
  }
};

export const getPlants = async (): Promise<Plant[]> => {
  const database = await openDB();
  try {
    console.log('[SQLite] Fetching all plants...');
    const result = database.execute('SELECT id, name, species, watering_frequency, added_date, last_watered_date, image_thumb, notes, sync_status FROM plants ORDER BY added_date DESC');
    const rows = result?.rows?._array ?? [];
    console.log('PLANT ROWS', rows.slice(0, 3));
    return rows;
  } catch (error) {
    console.error('[SQLite] Error fetching plants:', error);
    return [];
  }
};

export const getPlant = async (id: string): Promise<Plant | null> => {
  const database = await openDB();
  try {
    console.log(`[SQLite] Fetching plant with id: ${id}`);
    const result = database.execute('SELECT * FROM plants WHERE id = ?', [id]);
    console.log('[SQLite] Plant fetched:', result?.rows?._array?.[0]);
    return result?.rows?._array?.[0] ?? null;
  } catch (error) {
    console.error('[SQLite] Error fetching plant:', error);
    return null;
  }
};

export const getPlantById = getPlant; // For consistency with usage in add.tsx

export const updatePlant = async (id: string, updates: Partial<Plant>): Promise<void> => {
  const database = await openDB();
  const keys = Object.keys(updates);
  if (keys.length === 0) return;
  try {
    console.log(`[SQLite] Updating plant ${id} with:`, updates);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => (updates as any)[k]);
    database.execute(`UPDATE plants SET ${setClause}, sync_status = 1 WHERE id = ?`, [...values, id]);
    console.log('[SQLite] Plant updated:', id);
  } catch (error) {
    console.error('[SQLite] Error updating plant:', error);
    throw error;
  }
};

export const deletePlant = async (id: string): Promise<void> => {
  const database = await openDB();
  try {
    console.log(`[SQLite] Deleting plant and related records for id: ${id}`);
    database.execute('DELETE FROM plants WHERE id = ?', [id]);
    database.execute('DELETE FROM watering_history WHERE plant_id = ?', [id]);
    database.execute('DELETE FROM moments WHERE plant_id = ?', [id]);
    database.execute('DELETE FROM goals WHERE plant_id = ?', [id]);
    database.execute('DELETE FROM plant_notes WHERE plant_id = ?', [id]);
    console.log('[SQLite] Plant deleted:', id);
  } catch (error) {
    console.error('[SQLite] Error deleting plant:', error);
    throw error;
  }
};

/* ---------- Watering History ---------- */

export const addWateringRecord = async (plant_id: string, notes = ''): Promise<WateringHistory> => {
  const database = await openDB();
  const id = Date.now().toString();
  const watered_date = new Date().toISOString();
  try {
    console.log(`[SQLite] Adding watering record for plant ${plant_id}`);
    database.execute(
      `INSERT INTO watering_history (id, plant_id, watered_date, notes, sync_status) VALUES (?, ?, ?, ?, ?)`,
      [id, plant_id, watered_date, notes, 1]
    );
    database.execute(`UPDATE plants SET last_watered_date = ?, sync_status = 1 WHERE id = ?`, [watered_date, plant_id]);
    console.log('[SQLite] Watering record added:', id);
    return { id, plant_id, watered_date, notes };
  } catch (error) {
    console.error('[SQLite] Error adding watering record:', error);
    throw error;
  }
};

export const getWateringHistory = async (plant_id: string): Promise<WateringHistory[]> => {
  const database = await openDB();
  try {
    console.log(`[SQLite] Fetching watering history for plant ${plant_id}`);
    const result = database.execute('SELECT * FROM watering_history WHERE plant_id = ? ORDER BY watered_date DESC', [plant_id]);
    console.log('[SQLite] Watering history fetched');
    return result?.rows?._array ?? [];
  } catch (error) {
    console.error('[SQLite] Error fetching watering history:', error);
    return [];
  }
};

/* ---------- Moments ---------- */

export const addMoment = async (plant_id: string, image: string, caption = ''): Promise<Moment> => {
  const database = await openDB();
  const id = Date.now().toString();
  const date = new Date().toISOString();
  try {
    console.log(`[SQLite] Adding moment for plant ${plant_id}`);
    database.execute(
      `INSERT INTO moments (id, plant_id, image, caption, date, sync_status) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, plant_id, image, caption, date, 1]
    );
    console.log('[SQLite] Moment added:', id);
    return { id, plant_id, image, caption, date };
  } catch (error) {
    console.error('[SQLite] Error adding moment:', error);
    throw error;
  }
};

export const getMoments = async (plant_id: string): Promise<Moment[]> => {
  const database = await openDB();
  try {
    console.log(`[SQLite] Fetching moments for plant ${plant_id}`);
    const result = database.execute('SELECT * FROM moments WHERE plant_id = ? ORDER BY date DESC', [plant_id]);
    console.log('[SQLite] Moments fetched');
    return result?.rows?._array ?? [];
  } catch (error) {
    console.error('[SQLite] Error fetching moments:', error);
    return [];
  }
};

/* ---------- Goals ---------- */

export const addGoal = async (plant_id: string, title: string, description = '', target_date = ''): Promise<Goal> => {
  const database = await openDB();
  const id = Date.now().toString();
  try {
    console.log(`[SQLite] Adding goal for plant ${plant_id}`);
    database.execute(
      `INSERT INTO goals (id, plant_id, title, description, target_date, completed, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, plant_id, title, description, target_date, 0, 1]
    );
    console.log('[SQLite] Goal added:', id);
    return { id, plant_id, title, description, target_date, completed: 0 };
  } catch (error) {
    console.error('[SQLite] Error adding goal:', error);
    throw error;
  }
};

export const getGoals = async (plant_id: string): Promise<Goal[]> => {
  const database = await openDB();
  try {
    console.log(`[SQLite] Fetching goals for plant ${plant_id}`);
    const result = database.execute('SELECT * FROM goals WHERE plant_id = ? ORDER BY target_date ASC', [plant_id]);
    console.log('[SQLite] Goals fetched');
    return result?.rows?._array ?? [];
  } catch (error) {
    console.error('[SQLite] Error fetching goals:', error);
    return [];
  }
};

export const updateGoal = async (id: string, updates: Partial<Goal>): Promise<void> => {
  const database = await openDB();
  const keys = Object.keys(updates);
  if (keys.length === 0) return;
  try {
    console.log(`[SQLite] Updating goal ${id} with:`, updates);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => (updates as any)[k]);
    database.execute(`UPDATE goals SET ${setClause} WHERE id = ?`, [...values, id]);
    console.log('[SQLite] Goal updated:', id);
  } catch (error) {
    console.error('[SQLite] Error updating goal:', error);
    throw error;
  }
};

/* ---------- Plant Notes ---------- */

export const addPlantNote = async (plant_id: string, note: string): Promise<PlantNote> => {
  const database = await openDB();
  const id = Date.now().toString();
  const date = new Date().toISOString();
  try {
    console.log(`[SQLite] Adding plant note for plant ${plant_id}`);
    database.execute(
      `INSERT INTO plant_notes (id, plant_id, note, date, sync_status) VALUES (?, ?, ?, ?, ?)`,
      [id, plant_id, note, date, 1]
    );
    console.log('[SQLite] Plant note added:', id);
    return { id, plant_id, note, date };
  } catch (error) {
    console.error('[SQLite] Error adding plant note:', error);
    throw error;
  }
};

export const getPlantNotes = async (plant_id: string): Promise<PlantNote[]> => {
  const database = await openDB();
  try {
    console.log(`[SQLite] Fetching plant notes for plant ${plant_id}`);
    const result = database.execute('SELECT * FROM plant_notes WHERE plant_id = ? ORDER BY date DESC', [plant_id]);
    console.log('[SQLite] Plant notes fetched');
    return result?.rows?._array ?? [];
  } catch (error) {
    console.error('[SQLite] Error fetching plant notes:', error);
    return [];
  }
};

/* ---------- Search ---------- */

export const searchPlants = async (query: string): Promise<Plant[]> => {
  const database = await openDB();
  try {
    console.log(`[SQLite] Searching plants with query: ${query}`);
    const result = database.execute(
      'SELECT * FROM plants WHERE name LIKE ? OR species LIKE ? ORDER BY name ASC',
      [`%${query}%`, `%${query}%`]
    );
    console.log('[SQLite] Search complete');
    return result?.rows?._array ?? [];
  } catch (error) {
    console.error('[SQLite] Error searching plants:', error);
    return [];
  }
};

/* ---------- Pagination ---------- */

export const getPlantsPaginated = async (offset: number, limit: number): Promise<Plant[]> => {
  const database = await openDB();
  try {
    console.log(`[SQLite] Fetching plants paginated: offset=${offset}, limit=${limit}`);
    const result = database.execute(
      'SELECT id, name, species, watering_frequency, added_date, last_watered_date, image_thumb, notes, sync_status FROM plants ORDER BY added_date DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const rows = result?.rows?._array ?? [];
    return rows;
  } catch (error) {
    console.error('[SQLite] Error fetching paginated plants:', error);
    return [];
  }
};

export const getPlantsCount = async (): Promise<number> => {
  const database = await openDB();
  try {
    const result = database.execute('SELECT COUNT(*) as count FROM plants');
    const count = result?.rows?._array?.[0]?.count ?? 0;
    return count;
  } catch (error) {
    console.error('[SQLite] Error fetching plants count:', error);
    return 0;
  }
};

/* ---------- Utility / close ---------- */

export const closeDB = async (): Promise<void> => {
  if (!db) return;
  try {
    console.log('[SQLite] Closing database...');
    db.close();
    db = null;
    console.log('[SQLite] Database closed');
  } catch (err) {
    console.error('[SQLite] closeDB error:', err);
    throw err;
  }
};

// All data operations use local SQLite only; no external API calls are present.
