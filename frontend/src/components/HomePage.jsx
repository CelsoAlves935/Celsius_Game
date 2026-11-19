import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Gamepad2, ListTodo, Lock, LogOut, Plus, RefreshCw } from 'lucide-react';
import { deleteGame, getGames, updateGame } from '../services/api';
import { PLATFORM_LABELS, STATUS_META } from '../constants/gameMeta';
import { GameCard } from './GameCard';
import { LoginModal } from './LoginModal';
import { GameFormModal } from './GameFormModal';
import { GameDetailModal } from './GameDetailModal';
import { BacklogModal } from './BacklogModal';

const TOKEN_STORAGE_KEY = 'celsius_library_token';

const FILTER_OPTIONS = [
  { key: null, label: 'Todos' },
  { key: 'PLATINUM', label: 'Platinado' },
  { key: 'COMPLETED', label: 'Zerado' },
  { key: 'PLAYING', label: 'Jogando' },
];

export function HomePage({ onGamesUpdated }) {
  const [games, setGames] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [backlogOpen, setBacklogOpen] = useState(false);
  const [backlogSelectedGame, setBacklogSelectedGame] = useState(null);
  const [formState, setFormState] = useState({ open: false, gameToEdit: null });

  const [dragState, setDragState] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const isAdmin = Boolean(token);

  async function loadGames(focusGameId = null) {
    setLoading(true);
    setError(null);
    try {
      const data = await getGames();
      setGames(data);
      onGamesUpdated?.(data);

      if (focusGameId) {
        const currentList = data.filter((g) => g.isCurrent);
        const targetIdx = currentList.findIndex((g) => g.id === focusGameId);
        if (targetIdx !== -1) {
          setCarouselIndex(targetIdx);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (err) {
      setError(
        err.message || 'Não foi possível conectar ao servidor da biblioteca.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  const playingGames = games.filter((g) => g.isCurrent);
  const safeCarouselIndex =
    playingGames.length > 0 ? carouselIndex % playingGames.length : 0;
  const currentGame = playingGames[safeCarouselIndex] || null;

  const mainCatalogGames = games.filter((g) => g.status !== 'BACKLOG');
  const filteredGames = statusFilter
    ? mainCatalogGames.filter((g) => g.status === statusFilter)
    : mainCatalogGames;

  const backlogGames = games.filter((g) => g.status === 'BACKLOG');

  function handlePrevSlide() {
    if (playingGames.length <= 1) return;
    setCarouselIndex(
      (prev) => (prev - 1 + playingGames.length) % playingGames.length
    );
  }

  function handleNextSlide() {
    if (playingGames.length <= 1) return;
    setCarouselIndex((prev) => (prev + 1) % playingGames.length);
  }

  function getCarouselPosition(index) {
    const total = playingGames.length;
    if (total <= 1) return 'center';

    const diff = (index - safeCarouselIndex + total) % total;
    if (diff === 0) return 'center';
    if (diff === 1) return 'next';
    if (total > 2 && diff === total - 1) return 'prev';
    return 'hidden';
  }

  function handleLoginSuccess(newToken) {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }

  function handleOpenCreate() {
    setFormState({ open: true, gameToEdit: null });
  }

  function handleOpenEdit(game) {
    setSelectedGame(null);
    setBacklogSelectedGame(null);
    setFormState({ open: true, gameToEdit: game });
  }

  async function handleDeleteGame(id) {
    try {
      await deleteGame(id, token);
      setSelectedGame(null);
      setBacklogSelectedGame(null);
      loadGames();
    } catch (err) {
      alert(err.message || 'Erro ao excluir jogo. Verifique se sua sessão ainda é válida.');
    }
  }

  async function handlePatchGame(game, overrides) {
    try {
      await updateGame(
        game.id,
        {
          title: game.title,
          platform: game.platform,
          status: game.status,
          rating: game.rating,
          hoursPlayed: game.hoursPlayed,
          coverUrl: game.coverUrl,
          review: game.review,
          isCurrent: game.isCurrent,
          ...overrides,
        },
        token
      );
      setSelectedGame(null);
      setBacklogSelectedGame(null);
      const focusId = overrides.isCurrent ? game.id : null;
      await loadGames(focusId);
    } catch (err) {
      alert(err.message || 'Erro ao atualizar o jogo.');
    }
  }

  /* --- Drag & Drop entre Grid e Backlog --- */
  function handleDragStart(e, game, source) {
    if (!isAdmin) return;
    setDragState({ game, source });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', game.id);
  }

  function handleDragEnd() {
    setDragState(null);
    setDropTarget(null);
  }

  function handleGridDragOver(e) {
    if (dragState?.source !== 'backlog') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTarget !== 'grid') setDropTarget('grid');
  }

  async function handleGridDrop(e) {
    e.preventDefault();
    if (dragState?.source !== 'backlog') return;
    const droppedGame = dragState.game;
    handleDragEnd();
    setBacklogOpen(false);
    await handlePatchGame(droppedGame, { status: 'PLAYING', isCurrent: true });
  }

  function handleBacklogDragOver(e) {
    if (dragState?.source !== 'grid') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!backlogOpen) setBacklogOpen(true);
    if (dropTarget !== 'backlog') setDropTarget('backlog');
  }

  async function handleBacklogDrop(e) {
    e.preventDefault();
    if (dragState?.source !== 'grid') return;
    const droppedGame = dragState.game;
    handleDragEnd();
    await handlePatchGame(droppedGame, { status: 'BACKLOG', isCurrent: false });
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-actions">
          {isAdmin ? (
            <>
              <button
                type="button"
                className="btn-add-game"
                onClick={handleOpenCreate}
              >
                <Plus size={16} />
                <span>Adicionar Jogo</span>
              </button>
              <button
                type="button"
                className="admin-btn"
                onClick={handleLogout}
                title="Sair do modo administrador"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="admin-btn"
              onClick={() => setShowLoginModal(true)}
            >
              <Lock size={16} />
              <span>Admin</span>
            </button>
          )}
        </div>
      </header>

      {loading && (
        <div className="state-box">
          <p>Carregando biblioteca...</p>
          <small>
            Se o servidor gratuito estiver acordando, isso pode levar alguns
            instantes.
          </small>
        </div>
      )}

      {!loading && error && (
        <div className="state-box error">
          <p>{error}</p>
          <button
            type="button"
            className="retry-btn"
            onClick={() => loadGames()}
          >
            <RefreshCw size={16} /> Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {currentGame && (
            <section
              key={currentGame.id}
              className="featured-section fade-transition"
              aria-label="Jogos em andamento"
            >
              <span
                className="featured-label"
                style={{
                  color: STATUS_META[currentGame.status]?.color || '#ffffff',
                }}
              >
                JOGO ATUAL
              </span>

              <div className="carousel-stage">
                {playingGames.length > 1 && (
                  <button
                    type="button"
                    className="carousel-arrow"
                    onClick={handlePrevSlide}
                    aria-label="Jogo anterior"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                <div className="carousel-track">
                  {playingGames.map((game, idx) => {
                    const pos = getCarouselPosition(idx);
                    return (
                      <div
                        key={game.id}
                        className={`carousel-item pos-${pos}`}
                      >
                        <GameCard
                          game={game}
                          featured
                          onClick={
                            pos === 'center'
                              ? setSelectedGame
                              : () => setCarouselIndex(idx)
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                {playingGames.length > 1 && (
                  <button
                    type="button"
                    className="carousel-arrow"
                    onClick={handleNextSlide}
                    aria-label="Próximo jogo"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>

              {playingGames.length > 1 && (
                <div className="carousel-dots" aria-label="Indicadores do carrossel">
                  {playingGames.map((g, idx) => (
                    <button
                      key={g.id}
                      type="button"
                      className={`carousel-dot ${idx === safeCarouselIndex ? 'active' : ''}`}
                      onClick={() => setCarouselIndex(idx)}
                      aria-label={`Ver ${g.title}`}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          <div className="filter-bar" role="group" aria-label="Filtrar por status">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className={`filter-pill ${statusFilter === opt.key ? 'active' : ''}`}
                onClick={() => setStatusFilter(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <main
            className={`main-catalog ${dropTarget === 'grid' ? 'drop-zone-active' : ''}`}
            onDragOver={handleGridDragOver}
            onDragLeave={() => setDropTarget((prev) => (prev === 'grid' ? null : prev))}
            onDrop={handleGridDrop}
          >
            {dropTarget === 'grid' && (
              <div className="drop-hint">Solte aqui para começar a jogar!</div>
            )}

            {filteredGames.length === 0 ? (
              <div className="state-box">
                <p>Nenhum jogo encontrado nesta categoria.</p>
                {isAdmin ? (
                  <button
                    type="button"
                    className="btn-add-game"
                    onClick={handleOpenCreate}
                  >
                    <Plus size={16} /> Cadastrar jogo
                  </button>
                ) : (
                  <small>Faça login como Admin para cadastrar jogos.</small>
                )}
              </div>
            ) : (
              <section className="games-grid fade-transition" aria-label="Catálogo de jogos">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    draggable={isAdmin}
                    onDragStart={(e, g) => handleDragStart(e, g, 'grid')}
                    onDragEnd={handleDragEnd}
                    onClick={setSelectedGame}
                  />
                ))}
              </section>
            )}
          </main>

          {backlogOpen && !dragState && (
            <div
              className="drawer-backdrop"
              onClick={() => setBacklogOpen(false)}
              aria-hidden="true"
            />
          )}

          <aside
            className={`backlog-drawer ${backlogOpen ? 'open' : ''}`}
            aria-label="Aba lateral do Backlog"
            onDragOver={handleBacklogDragOver}
            onDragLeave={() => setDropTarget((prev) => (prev === 'backlog' ? null : prev))}
            onDrop={handleBacklogDrop}
          >
            <button
              type="button"
              className="backlog-tab"
              onClick={() => setBacklogOpen((prev) => !prev)}
              aria-expanded={backlogOpen}
              aria-label={backlogOpen ? 'Fechar lista de backlog' : 'Abrir lista de backlog'}
              title="Na Lista (Backlog)"
            >
              {backlogOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              <span className="backlog-tab-count">{backlogGames.length}</span>
            </button>

            <div className={`backlog-drawer-panel ${dropTarget === 'backlog' ? 'drop-zone-active' : ''}`}>
              <div className="column-header">
                <h2 className="column-title">
                  <ListTodo size={18} /> Na Lista
                </h2>
                <span className="column-count">{backlogGames.length}</span>
              </div>

              {dropTarget === 'backlog' && (
                <div className="drop-hint">Solte aqui para enviar ao Backlog!</div>
              )}

              {backlogGames.length === 0 ? (
                <p className="column-empty">
                  Nenhum jogo na fila do backlog.
                </p>
              ) : (
                <div className="backlog-list">
                  {backlogGames.map((game) => (
                    <button
                      key={game.id}
                      type="button"
                      className="backlog-item"
                      draggable={isAdmin}
                      onDragStart={(e) => handleDragStart(e, game, 'backlog')}
                      onDragEnd={handleDragEnd}
                      onClick={() => setBacklogSelectedGame(game)}
                    >
                      {game.coverUrl ? (
                        <img
                          src={game.coverUrl}
                          alt={game.title}
                          className="backlog-thumb"
                          draggable={false}
                        />
                      ) : (
                        <div className="backlog-thumb backlog-thumb-empty">
                          <Gamepad2 size={18} opacity={0.6} />
                        </div>
                      )}
                      <div className="backlog-item-info">
                        <strong>{game.title}</strong>
                        <span>
                          {PLATFORM_LABELS[game.platform] || game.platform}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          isAdmin={isAdmin}
          onClose={() => setSelectedGame(null)}
          onToggleCurrent={(game, isCurrent) =>
            handlePatchGame(game, { isCurrent })
          }
          onMoveToBacklog={(game) =>
            handlePatchGame(game, { status: 'BACKLOG', isCurrent: false })
          }
          onEdit={handleOpenEdit}
          onDelete={handleDeleteGame}
        />
      )}

      {backlogSelectedGame && (
        <BacklogModal
          game={backlogSelectedGame}
          isAdmin={isAdmin}
          onClose={() => setBacklogSelectedGame(null)}
          onStartPlaying={(game) =>
            handlePatchGame(game, { status: 'PLAYING', isCurrent: true })
          }
          onEdit={handleOpenEdit}
          onDelete={handleDeleteGame}
        />
      )}

      {formState.open && (
        <GameFormModal
          gameToEdit={formState.gameToEdit}
          token={token}
          onClose={() => setFormState({ open: false, gameToEdit: null })}
          onSaved={() => loadGames()}
        />
      )}
    </div>
  );
}
