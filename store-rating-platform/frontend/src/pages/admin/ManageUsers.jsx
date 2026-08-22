import { useEffect, useState } from 'react';
import * as adminApi from '../../api/adminApi';
import Table from '../../components/common/Table';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [formError, setFormError] = useState('');

  function loadUsers(sortBy, order) {
    const params = { ...filters };
    if (sortBy) { params.sortBy = sortBy; params.order = order; }
    // remove empty filters so they don't get sent as blank query params
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);

    adminApi
      .listUsers(params)
      .then((res) => setUsers(res.data.data.users))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'));
  }

  useEffect(() => { loadUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAddUser(e) {
    e.preventDefault();
    setFormError('');
    try {
      await adminApi.addUser(newUser);
      setShowForm(false);
      setNewUser({ name: '', email: '', address: '', password: '', role: 'user' });
      loadUsers();
    } catch (err) {
      setFormError(err.response?.data?.errors?.join(', ') || err.response?.data?.message || 'Failed to add user');
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'role', label: 'Role' }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Manage Users</h2>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      <div style={styles.filterRow}>
        <input placeholder="Filter by name" value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} style={styles.filterInput} />
        <input placeholder="Filter by email" value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })} style={styles.filterInput} />
        <input placeholder="Filter by address" value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })} style={styles.filterInput} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} style={styles.filterInput}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button onClick={() => loadUsers()} style={styles.applyBtn}>Apply Filters</button>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddUser} style={styles.form}>
          {formError && <p style={{ color: '#dc2626' }}>{formError}</p>}
          <input placeholder="Name (20-60 chars)" value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required style={styles.input} />
          <input placeholder="Email" type="email" value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required style={styles.input} />
          <input placeholder="Address" value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} style={styles.input} />
          <input placeholder="Password" type="password" value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required style={styles.input} />
          <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={styles.input}>
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
          <button type="submit" style={styles.applyBtn}>Create User</button>
        </form>
      )}

      <Table columns={columns} data={users} onSort={(key, order) => loadUsers(key, order)} />
    </div>
  );
}

const styles = {
  filterRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' },
  filterInput: { padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' },
  applyBtn: { padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  addBtn: { padding: '8px 14px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', width: '340px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' },
  input: { padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }
};
