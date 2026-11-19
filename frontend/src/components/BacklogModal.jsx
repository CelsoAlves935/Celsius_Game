import { Edit3, Gamepad2, Play, Trash2, X } from 'lucide-react';
import { PLATFORM_LABELS } from '../constants/gameMeta';

export function BacklogModal({
  game,
  isAdmin,
  onClose,
  onStartPlaying,
  onEdit,
  onDelete,
}) {
  if (!game) return null;

  function handleDelete() {
    if (window.confirm(`Tem certeza que deseja excluir "${game.title}"?`)) {
      onDelete(game.id);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="detail-status-pill" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
            na lista
          </span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="backlog-modal-body">
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={`Capa de ${game.title}`}
              className="backlog-modal-cover"
            />
          ) : (
            <div className="backlog-modal-cover detail-cover-empty">
              <Gamepad2 size={36} opacity={0.5} />
            </div>
          )}

          <h3>{game.title}</h3>
          <p className="detail-platform">
            {PLATFORM_LABELS[game.platform] || game.platform}
          </p>
        </div>

        {isAdmin && (
          <div className="backlog-modal-actions">
            <button
              type="button"
              className="btn-play-game"
              style={{ width: '100%', marginRight: 0 }}
              onClick={() => onStartPlaying(game)}
            >
              <Play size={16} fill="currentColor" /> Jogar
            </button>

            <div className="backlog-modal-secondary">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onEdit(game)}
              >
                <Edit3 size={15} /> Editar
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
              >
                <Trash2 size={15} /> Excluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
