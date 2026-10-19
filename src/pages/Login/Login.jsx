import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import { EmailIcon, EyeIcon, EyeOffIcon, GridIcon, LockIcon } from '@/shared/ui/icons';
import './Login.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password.length >= 6) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img className="login-logo-icon" src={GridIcon} width="22" height="22" alt="TrelloAlt" />
            <h2>TrelloAlt</h2>
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to continue to your boards</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <img className="input-icon" src={EmailIcon} alt="" />
              <input id="email" type="email" placeholder="olena@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <span className="spacer" aria-hidden="true" />
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <img className="input-icon" src={LockIcon} alt="" />
              <input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}>
                <img src={showPassword ? EyeOffIcon : EyeIcon} alt="" />
              </button>
            </div>
          </div>

          <div className="checkbox-group">
            <Checkbox checked={keepSignedIn} id="keepSignedIn" onChange={(e) => setKeepSignedIn(e.target.checked)} />
            <label htmlFor="keepSignedIn">Keep me signed in</label>
          </div>

          <Button className="btn-signin" type="submit" variant="primary">Sign in</Button>
          <div className="login-footer">
            <span>Don't have an account?</span>
            <a href="#" className="sign-up-link">Sign up</a>
          </div>
        </form>
      </div>
      <div className="page-footer">© 2026 TrelloAlt</div>
    </div>
  );
}
