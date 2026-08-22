import { useEffect, useState } from 'react';
import * as adminApi from '../../api/adminApi';
import Table from '../../components/common/Table';

const emptyStore = { name: '', email: '', address: '', ownerId: '' };

export default function ManageStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [storeForm, setStoreForm] = useState(emptyStore);
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [owners, setOwners] = useState([]);
  const [formError, setFormError] = useState('');

  function loadStores(sortBy, order) {
    const params = { ...filters };
    if (sortBy) { params.sortBy = sortBy; params.order = order; }
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);

    adminApi
      .listStores(params)
      .then((res) => setStores(res.data.data.stores))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stores'));
  }

  useEffect(() => {
    loadStores();
    adminApi.listUsers({ role: 'store_owner' }).then((res) => setOwners(res.data.data.users));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function closeForm() {
    setShowForm(false);
    setEditingStoreId(null);
    setStoreForm(emptyStore);
    setFormError('');
  }

  function startEdit(store) {
    setStoreForm({
      name: store.name,
      email: store.email,
      address: store.address || '',
      ownerId: String(store.owner_id || store.owner?.id || '')
    });
    setEditingStoreId(store.id);
    setFormError('');
    setShowForm(true);
  }

  async function handleStoreSubmit(e) {
    e.preventDefault();
    setFormError('');
    try {
      if (editingStoreId) {
        await adminApi.updateStore(editingStoreId, storeForm);
      } else {
        await adminApi.addStore(storeForm);
      }
      closeForm();
      loadStores();
    } catch (err) {
      setFormError(err.response?.data?.errors?.join(', ') || err.response?.data?.message || `Failed to ${editingStoreId ? 'update' : 'add'} store`);
    }
  }

  async function handleDelete(store) {
    if (!window.confirm(`Delete ${store.name}? This also permanently removes its ratings.`)) return;
    setError('');
    try {
      await adminApi.deleteStore(store.id);
      loadStores();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete store');
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    {
      key: 'averageRating',
      label: 'Rating',
      render: (row) => row.averageRating ? Number(row.averageRating).toFixed(1) : 'No ratings yet'
    },
    { key: 'owner', label: 'Owner', render: (row) => row.owner ? row.owner.name : '-' }
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Manage Stores</h2>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      <div style={styles.filterRow}>
        <input placeholder="Filter by name" value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} style={styles.filterInput} />
        <input placeholder="Filter by email" value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })} style={styles.filterInput} />
        <input placeholder="Filter by address" value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })} style={styles.filterInput} />
        <button onClick={() => loadStores()} style={styles.applyBtn}>Apply Filters</button>
        <button onClick={() => (showForm ? closeForm() : setShowForm(true))} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add Store'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleStoreSubmit} style={styles.form}>
          <h3 style={{ margin: 0 }}>{editingStoreId ? 'Edit Store' : 'Create Store'}</h3>
          {formError && <p style={{ color: '#dc2626' }}>{formError}</p>}
          <input placeholder="Store Name" value={storeForm.name}
            onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} required style={styles.input} />
          <input placeholder="Email" type="email" value={storeForm.email}
            onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })} required style={styles.input} />
          <input placeholder="Address" value={storeForm.address}
            onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} style={styles.input} />
          <select value={storeForm.ownerId} onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })} required style={styles.input}>
            <option value="">Select Store Owner</option>
            {owners.map((owner) => <option value={owner.id} key={owner.id}>{owner.name} — {owner.email}</option>)}
          </select>
          <button type="submit" style={styles.applyBtn}>{editingStoreId ? 'Save Changes' : 'Create Store'}</button>
        </form>
      )}

      <Table
        columns={columns}
        data={stores}
        onSort={(key, order) => loadStores(key, order)}
        renderActions={(store) => (
          <div style={styles.actions}>
            <button onClick={() => startEdit(store)} style={styles.editBtn}>Edit</button>
            <button onClick={() => handleDelete(store)} style={styles.deleteBtn}>Delete</button>
          </div>
        )}
      />
    </div>
  );
}

const styles = {
  filterRow: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' },
  filterInput: { padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' },
  applyBtn: { padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  addBtn: { padding: '8px 14px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', width: '340px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' },
  input: { padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: { padding: '6px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};
