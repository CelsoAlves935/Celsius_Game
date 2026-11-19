const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = `Erro ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Resposta sem corpo JSON
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getGames(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/api/games${query}`);
}

export function login(username, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

export function createGame(gameData, token) {
  return request('/api/games', {
    method: 'POST',
    body: gameData,
    token,
  });
}

export function updateGame(id, gameData, token) {
  return request(`/api/games/${id}`, {
    method: 'PUT',
    body: gameData,
    token,
  });
}

export function deleteGame(id, token) {
  return request(`/api/games/${id}`, {
    method: 'DELETE',
    token,
  });
}
