import { useState } from 'react';
import { X } from 'lucide-react';
import { login } from '../services/api';

export function LoginModal({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(username, password);
      onLoginSuccess(data.token);
      onClose();
    } catch {
      setError('Usuário ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Acesso Administrativo</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <p className="form-error">{error}</p>}

          <label className="form-field">
            <span>Usuário</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoFocus
            />
          </label>

          <label className="form-field">
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
