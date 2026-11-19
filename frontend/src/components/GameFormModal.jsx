import { useState } from 'react';
import { X } from 'lucide-react';
import { PLATFORM_LABELS, STATUS_META } from '../constants/gameMeta';
import { createGame, updateGame } from '../services/api';

export function GameFormModal({ gameToEdit, token, onClose, onSaved }) {
  const isEditing = Boolean(gameToEdit);

  const [title, setTitle] = useState(gameToEdit?.title || '');
  const [platform, setPlatform] = useState(gameToEdit?.platform || 'PC');
  const [status, setStatus] = useState(gameToEdit?.status || 'PLAYING');
  const [rating, setRating] = useState(gameToEdit?.rating ?? '');
  const [hoursPlayed, setHoursPlayed] = useState(gameToEdit?.hoursPlayed ?? 0);
  const [coverUrl, setCoverUrl] = useState(gameToEdit?.coverUrl || '');
  const [review, setReview] = useState(gameToEdit?.review || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title: title.trim(),
      platform,
      status,
      rating: rating === '' ? null : Number(rating),
      hoursPlayed: hoursPlayed === '' ? 0 : Number(hoursPlayed),
      coverUrl: coverUrl.trim() || null,
      review: review.trim() || null,
      isCurrent: gameToEdit?.isCurrent ?? false,
    };

    try {
      if (isEditing) {
        await updateGame(gameToEdit.id, payload, token);
      } else {
        await createGame(payload, token);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao salvar o jogo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Editar Jogo' : 'Adicionar Novo Jogo'}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <p className="form-error">{error}</p>}

          <label className="form-field">
            <span>Título *</span>
            <input
              type="text"
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Elden Ring"
              required
              autoFocus
            />
          </label>

          <div className="form-row">
            <label className="form-field">
              <span>Plataforma *</span>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>Status *</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {Object.entries(STATUS_META).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row">
            <label className="form-field">
              <span>Nota (0 a 10)</span>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="9.5"
              />
            </label>

            <label className="form-field">
              <span>Horas Jogadas</span>
              <input
                type="number"
                min="0"
                value={hoursPlayed}
                onChange={(e) => setHoursPlayed(e.target.value)}
              />
            </label>
          </div>

          <label className="form-field">
            <span>URL da Capa (opcional)</span>
            <input
              type="url"
              maxLength={500}
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="form-field">
            <span>Análise / Anotações</span>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="O que achou do jogo?"
            />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
