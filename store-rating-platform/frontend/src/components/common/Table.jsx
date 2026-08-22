import { useState } from 'react';

/**
 * columns: [{ key: 'name', label: 'Name' }, ...]
 * data: array of row objects
 * onSort(key, order): optional callback for server-side sorting
 */
export default function Table({ columns, data, onSort, renderActions }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('ASC');

  function handleHeaderClick(key) {
    const newOrder = sortKey === key && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortKey(key);
    setSortOrder(newOrder);
    if (onSort) onSort(key, newOrder);
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              onClick={() => onSort && handleHeaderClick(col.key)}
              style={{ ...styles.th, cursor: onSort ? 'pointer' : 'default' }}
            >
              {col.label}
              {sortKey === col.key && (sortOrder === 'ASC' ? ' ▲' : ' ▼')}
            </th>
          ))}
          {renderActions && <th style={styles.th}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td colSpan={columns.length + (renderActions ? 1 : 0)} style={styles.emptyCell}>
              No records found.
            </td>
          </tr>
        )}
        {data.map((row, idx) => (
          <tr key={row.id || idx}>
            {columns.map((col) => (
              <td key={col.key} style={styles.td}>
                {col.render ? col.render(row) : row[col.key] ?? '-'}
              </td>
            ))}
            {renderActions && <td style={styles.td}>{renderActions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '12px' },
  th: {
    textAlign: 'left',
    padding: '10px',
    borderBottom: '2px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    userSelect: 'none'
  },
  td: { padding: '10px', borderBottom: '1px solid #e5e7eb' },
  emptyCell: { padding: '20px', textAlign: 'center', color: '#6b7280' }
};
