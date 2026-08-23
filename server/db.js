import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'data.json');

const DEFAULT_DATA = {
  categories: [],
  products: [],
  orders: [],
  order_items: [],
  _counters: { categories: 0, products: 0, orders: 0, order_items: 0 },
};

class JsonDB {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = this._load();
  }

  _load() {
    if (existsSync(this.filePath)) {
      try {
        return JSON.parse(readFileSync(this.filePath, 'utf-8'));
      } catch {
        return { ...DEFAULT_DATA };
      }
    }
    return { ...DEFAULT_DATA };
  }

  _save() {
    writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  _nextId(table) {
    this.data._counters[table] = (this.data._counters[table] || 0) + 1;
    return this.data._counters[table];
  }

  getAll(table) {
    return this.data[table] || [];
  }

  getById(table, id) {
    return this.data[table]?.find(item => item.id === id) || null;
  }

  getBy(table, field, value) {
    return this.data[table]?.find(item => item[field] === value) || null;
  }

  filter(table, predicate) {
    return (this.data[table] || []).filter(predicate);
  }

  insert(table, record) {
    const id = this._nextId(table);
    const item = { id, ...record, created_at: new Date().toISOString() };
    this.data[table].push(item);
    this._save();
    return item;
  }

  update(table, id, updates) {
    const index = this.data[table]?.findIndex(item => item.id === id);
    if (index === -1 || index === undefined) return null;
    this.data[table][index] = { ...this.data[table][index], ...updates };
    this._save();
    return this.data[table][index];
  }

  delete(table, id) {
    const before = this.data[table]?.length || 0;
    this.data[table] = this.data[table]?.filter(item => item.id !== id) || [];
    this._save();
    return (this.data[table].length < before);
  }

  deleteWhere(table, predicate) {
    this.data[table] = (this.data[table] || []).filter(item => !predicate(item));
    this._save();
  }

  clear(table) {
    this.data[table] = [];
    this.data._counters[table] = 0;
    this._save();
  }

  resetAll() {
    this.data = { ...DEFAULT_DATA, _counters: { categories: 0, products: 0, orders: 0, order_items: 0 } };
    this._save();
  }
}

const uploadsDir = join(__dirname, '..', 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const db = new JsonDB(DB_PATH);
export default db;
