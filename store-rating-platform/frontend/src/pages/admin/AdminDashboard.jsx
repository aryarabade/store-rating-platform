import { useEffect, useState } from 'react';
import * as adminApi from '../../api/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'));
  }, []);

  if (error) return <p style={{ padding: 20, color: '#dc2626' }}>{error}</p>;
  if (!stats) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <div style={styles.cardRow}>
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Stores" value={stats.totalStores} />
        <StatCard label="Total Ratings" value={stats.totalRatings} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardValue}>{value}</p>
      <p style={styles.cardLabel}>{label}</p>
    </div>
  );
}

const styles = {
  cardRow: { display: 'flex', gap: '20px', marginTop: '20px' },
  card: {
    flex: 1,
    padding: '24px',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6',
    textAlign: 'center'
  },
  cardValue: { fontSize: '32px', fontWeight: 'bold', margin: 0 },
  cardLabel: { color: '#6b7280', marginTop: '4px' }
};
