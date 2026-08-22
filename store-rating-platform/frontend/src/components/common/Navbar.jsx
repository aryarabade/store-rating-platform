import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}><span>★</span> StoreRate</Link>

      <div style={styles.links}>
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/admin/users" style={styles.link}>Users</Link>
            <Link to="/admin/stores" style={styles.link}>Stores</Link>
          </>
        )}
        {user?.role === 'user' && (
          <Link to="/user/dashboard" style={styles.link}>Discover Stores</Link>
        )}
        {user?.role === 'store_owner' && (
          <Link to="/owner/dashboard" style={styles.link}>My Dashboard</Link>
        )}

        {user && (
          <>
            <Link to={user.role === 'user' ? '/user/change-password' : user.role === 'store_owner' ? '/owner/change-password' : '/update-password'} style={styles.link}>Update Password</Link>
            <span style={styles.userInfo}>{user.name} <b>{user.role.replace('_', ' ')}</b></span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '13px clamp(18px, 4vw, 42px)',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e8eaf0',
    boxShadow: '0 4px 18px rgba(39,32,107,.05)'
  },
  brand: { color: '#171827', textDecoration: 'none', fontWeight: '800', fontSize: '19px' },
  links: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-end' },
  link: { color: '#5b4bdb', textDecoration: 'none', fontWeight: 700, fontSize: '14px' },
  userInfo: { color: '#6b7280', fontSize: '13px', textTransform: 'capitalize' },
  logoutBtn: {
    background: '#fff0f2',
    color: '#c62f47',
    border: '1px solid #ffd4dc',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
