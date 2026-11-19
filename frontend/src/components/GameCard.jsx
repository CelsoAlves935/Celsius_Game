import { useRef } from 'react';
import { Gamepad2 } from 'lucide-react';
import { PLATFORM_LABELS, STATUS_META } from '../constants/gameMeta';

export function GameCard({
  game,
  featured = false,
  draggable = false,
  onDragStart,
  onDragEnd,
  onClick,
}) {
  const innerRef = useRef(null);

  const statusInfo = STATUS_META[game.status] || {
    label: game.status?.toLowerCase() || '',
    color: '#ffffff',
  };

  function handleDragStart(e) {
    if (innerRef.current && e.dataTransfer?.setDragImage) {
      e.dataTransfer.setDragImage(
        innerRef.current,
        innerRef.current.offsetWidth / 2,
        innerRef.current.offsetHeight / 2
      );
    }
    onDragStart?.(e, game);
  }

  return (
    <div
      className={`game-card-wrapper ${featured ? 'featured' : ''}`}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {!featured && (
        <span className="game-status-label">{statusInfo.label}</span>
      )}

      <button
        type="button"
        className={`game-card ${featured ? 'featured' : ''}`}
        data-status={game.status}
        style={{
          '--card-glow': statusInfo.color,
        }}
        onClick={() => onClick?.(game)}
        title={game.title}
      >
        <div className="game-card-inner" ref={innerRef}>
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={`Capa de ${game.title}`}
              className="game-cover"
              draggable={false}
            />
          ) : (
            <div className="game-placeholder">
              <Gamepad2 size={featured ? 42 : 30} opacity={0.5} />
              <span className="game-placeholder-title">{game.title}</span>
            </div>
          )}

          <div className="game-overlay">
            <strong className="game-title">{game.title}</strong>
            <div className="game-meta">
              <span>{PLATFORM_LABELS[game.platform] || game.platform}</span>
              {game.rating != null && <span>★ {game.rating}</span>}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
