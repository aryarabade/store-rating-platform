import { useEffect, useState } from 'react';
import * as storeApi from '../../api/storeApi';
import Table from '../../components/common/Table';

export default function OwnerDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    storeApi
      .getOwnerDashboard()
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) {
    const noStoreLinked = error === 'No store is linked to this account yet';
    return (
      <div style={{ padding: 24 }}>
        <h2>Store Owner Dashboard</h2>
        <p style={{ color: noStoreLinked ? '#6b7280' : '#dc2626' }}>
          {noStoreLinked
            ? 'Your account is ready. Ask an administrator to link your store to this account, then your ratings will appear here.'
            : error}
        </p>
      </div>
    );
  }
  if (!data) return <p style={{ padding: 24 }}>Loading...</p>;

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'rating', label: 'Rating' },
    { key: 'ratedAt', label: 'Rated At', render: (row) => new Date(row.ratedAt).toLocaleDateString() }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>{data.store.name}</h2>
      <p style={{ color: '#6b7280' }}>{data.store.address}</p>

      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <p style={styles.statValue}>{data.averageRating || 'N/A'}</p>
          <p style={styles.statLabel}>Average Rating</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statValue}>{data.totalRatings}</p>
          <p style={styles.statLabel}>Total Ratings</p>
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Users Who Rated Your Store</h3>
      <Table columns={columns} data={data.raters} />
    </div>
  );
}

const styles = {
  statRow: { display: 'flex', gap: '20px', marginTop: '16px' },
  statCard: { flex: 1, padding: '20px', borderRadius: '8px', backgroundColor: '#f3f4f6', textAlign: 'center' },
  statValue: { fontSize: '28px', fontWeight: 'bold', margin: 0 },
  statLabel: { color: '#6b7280', marginTop: '4px' }
};
