import { Clock, Edit3, Gamepad2, Pause, Play, RotateCcw, Star, Trash2, X } from 'lucide-react';
import { PLATFORM_LABELS, STATUS_META } from '../constants/gameMeta';

export function GameDetailModal({
  game,
  isAdmin,
  onClose,
  onToggleCurrent,
  onMoveToBacklog,
  onEdit,
  onDelete,
}) {
  if (!game) return null;

  const statusInfo = STATUS_META[game.status] || {
    label: game.status,
    color: '#ffffff',
  };

  function handleDelete() {
    if (window.confirm(`Tem certeza que deseja excluir "${game.title}"?`)) {
      onDelete(game.id);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card detail-modal"
        style={{ borderColor: statusInfo.color }}
        onClick={(e) => e.stopPropagation()}
      >
        {game.coverUrl && (
          <div
            className="detail-bg-cover"
            style={{ backgroundImage: `url(${game.coverUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="detail-bg-gradient" aria-hidden="true" />

        <div className="detail-content">
          <div className="modal-header">
            <span
              className="detail-status-pill"
              style={{
                color: statusInfo.color,
                borderColor: statusInfo.color,
              }}
            >
              {statusInfo.label}
            </span>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
              <X size={20} />
            </button>
          </div>

          <div className="detail-body">
            {game.coverUrl ? (
              <img
                src={game.coverUrl}
                alt={`Capa de ${game.title}`}
                className="detail-cover"
                style={{ borderColor: statusInfo.color }}
              />
            ) : (
              <div
                className="detail-cover detail-cover-empty"
                style={{ borderColor: statusInfo.color }}
              >
                <Gamepad2 size={48} opacity={0.5} />
              </div>
            )}

            <div className="detail-info">
              <h2>{game.title}</h2>
              <p className="detail-platform">
                {PLATFORM_LABELS[game.platform] || game.platform}
              </p>

              <div className="detail-stats">
                {game.rating != null && (
                  <span>
                    <Star size={16} fill="currentColor" color="#ffd700" /> Nota:{' '}
                    <strong>{game.rating}</strong>/10
                  </span>
                )}
                <span>
                  <Clock size={16} />{' '}
                  <strong>{game.hoursPlayed ?? 0}h</strong> jogadas
                </span>
              </div>

              {game.review && (
                <div className="detail-review">
                  <h4>Análise</h4>
                  <p>{game.review}</p>
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="detail-actions">
              <div className="detail-actions-left">
                {!game.isCurrent ? (
                  <button
                    type="button"
                    className="btn-play-game"
                    onClick={() => onToggleCurrent(game, true)}
                  >
                    <Play size={16} fill="currentColor" /> Jogar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-stop-game"
                    onClick={() => onToggleCurrent(game, false)}
                  >
                    <Pause size={16} fill="currentColor" /> Parar de Jogar
                  </button>
                )}

                {game.status !== 'BACKLOG' && (
                  <button
                    type="button"
                    className="btn-backlog-game"
                    onClick={() => onMoveToBacklog(game)}
                  >
                    <RotateCcw size={15} /> Voltar ao Backlog
                  </button>
                )}
              </div>

              <div className="detail-actions-right">
                <button type="button" className="btn-secondary" onClick={() => onEdit(game)}>
                  <Edit3 size={16} /> Editar
                </button>
                <button type="button" className="btn-danger" onClick={handleDelete}>
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
