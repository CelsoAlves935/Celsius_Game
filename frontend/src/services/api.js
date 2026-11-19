const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(
  /\/+$/,
  ''
);

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o backend está ligado ou aguarde alguns segundos.'
    );
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      const authErr = new Error('Credenciais inválidas ou sessão expirada.');
      authErr.status = response.status;
      throw authErr;
    }

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
