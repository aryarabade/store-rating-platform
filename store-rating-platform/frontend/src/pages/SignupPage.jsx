import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setField = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  function validate() {
    if (form.name.trim().length < 20 || form.name.trim().length > 60) return 'Name must be between 20 and 60 characters';
    if (form.address.length > 400) return 'Address must not exceed 400 characters';
    if (form.password.length < 8 || form.password.length > 16) return 'Password must be 8–16 characters';
    if (!/[A-Z]/.test(form.password)) return 'Password must contain at least one uppercase letter';
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\;'`~]/.test(form.password)) return 'Password must contain at least one special character';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);
    setLoading(true); setError('');
    try {
      const payload = { ...form };
      delete payload.confirmPassword;
      await signup(payload);
      navigate('/login', { state: { message: 'Account created successfully. Please sign in as a Normal User.' } });
    } catch (err) { setError(err.response?.data?.errors?.join(', ') || err.response?.data?.message || 'Signup failed'); }
    finally { setLoading(false); }
  }

  return <div className="auth-shell"><aside className="auth-aside"><div className="auth-brand">★ StoreRate</div><div><p className="eyebrow">JOIN THE COMMUNITY</p><h1>Find stores worth talking about.</h1><p>Discover ratings, share your experience, and help your community shop with confidence.</p></div><div className="aside-card"><span className="stars">★★★★★</span><strong>Built on real experiences</strong><small>Every rating helps someone choose better.</small></div></aside><main className="auth-main"><form className="auth-card" onSubmit={handleSubmit}><Link className="mobile-brand" to="/">★ StoreRate</Link><p className="eyebrow">CREATE ACCOUNT</p><h2>Create Your Account</h2><p className="auth-subtitle">Join StoreRate and start discovering and rating amazing stores.</p>{error && <p className="form-alert error-alert">{error}</p>}<label>Full Name<input placeholder="20–60 characters" value={form.name} onChange={setField('name')} required /></label><label>Email<input type="email" placeholder="you@example.com" value={form.email} onChange={setField('email')} required /></label><label>Address<textarea placeholder="Your city or address" value={form.address} onChange={setField('address')} /></label><label>Password<input type="password" placeholder="8–16 chars, uppercase + special character" value={form.password} onChange={setField('password')} required /></label><label>Confirm Password<input type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={setField('confirmPassword')} required /></label><button className="auth-submit" disabled={loading}>{loading ? 'Creating account…' : 'Create Account →'}</button><p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p></form></main></div>;
}
