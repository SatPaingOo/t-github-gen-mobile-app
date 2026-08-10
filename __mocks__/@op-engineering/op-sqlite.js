/**
 * In-memory mock of @op-engineering/op-sqlite for Jest.
 *
 * `open()` returns an object with `execute(sql, params)` that implements the
 * tiny subset the adapter uses (CREATE TABLE, SELECT/INSERT/UPDATE/DELETE).
 * Data lives per-connection so tests are isolated.
 *
 * @format
 */

let idCounter = 0;

function buildConnection() {
  const tables = new Map(); // name -> { columns: string[], rows: any[][] }

  function ensureTable(sql) {
    const m = /CREATE TABLE IF NOT EXISTS (\w+)\s*\(([\s\S]*?)\)/.exec(sql);
    if (!m) return;
    const name = m[1];
    if (tables.has(name)) return;
    const columns = m[2]
      .split(',')
      .map(c => c.trim().split(/\s+/)[0])
      .filter(Boolean);
    tables.set(name, { columns, rows: [] });
  }

  function execute(sql, params = []) {
    ensureTable(sql);

    const insert = /INSERT INTO (\w+) \(([^)]+)\) VALUES \(([^)]+)\)/.exec(sql);
    if (insert) {
      const tableMeta = tables.get(insert[1]);
      const cols = insert[2].split(',').map(c => c.trim());
      const values = params.slice(0, cols.length);
      const row = Object.fromEntries(cols.map((c, i) => [c, values[i]]));
      const rowArr = tableMeta.columns.map(c => (c in row ? row[c] : null));
      tableMeta.rows.push(rowArr);
      return { rows: [], rowsAffected: 1 };
    }

    const select = /SELECT \* FROM (\w+)/.exec(sql);
    if (select) {
      const tableMeta = tables.get(select[1]);
      const rows = (tableMeta?.rows ?? []).map(arr =>
        Object.fromEntries(tableMeta.columns.map((c, i) => [c, arr[i]])),
      );
      return { rows, rowsAffected: 0 };
    }

    const update = /UPDATE (\w+) SET ([\s\S]*?) WHERE id = \?/.exec(sql);
    if (update) {
      const tableMeta = tables.get(update[1]);
      const assignments = update[2].split(',').map(s => s.trim().split(/\s*=\s*/));
      const id = params[params.length - 1];
      const values = params.slice(0, assignments.length);
      const row = tableMeta.rows.find(arr => arr[0] === id);
      if (!row) return { rows: [], rowsAffected: 0 };
      assignments.forEach(([col], i) => {
        const idx = tableMeta.columns.indexOf(col);
        if (idx >= 0) row[idx] = values[i];
      });
      return { rows: [], rowsAffected: 1 };
    }

    const del = /DELETE FROM (\w+) WHERE id = \?/.exec(sql);
    if (del) {
      const tableMeta = tables.get(del[1]);
      const id = params[0];
      const before = tableMeta.rows.length;
      tableMeta.rows = tableMeta.rows.filter(arr => arr[0] !== id);
      return { rows: [], rowsAffected: before - tableMeta.rows.length };
    }

    return { rows: [], rowsAffected: 0 };
  }

  return { execute, executeSync: execute, close() {} };
}

export function open() {
  const conn = buildConnection();
  idCounter += 1;
  return conn;
}

export default { open };
