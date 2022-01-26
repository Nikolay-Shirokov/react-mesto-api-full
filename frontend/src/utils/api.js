class Api {

  constructor(options) {
    this._options = options;
  }

  _sendQuery(url, queryParams = {}) {
    queryParams.credentials = 'include';
    return fetch(`${this._options.baseUrl}/${url}`, queryParams)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
  }

  getInitialCards() {
    return this._sendQuery('cards');
  }

  getUserInfo() {
    return this._sendQuery('users/me');
  }

  patchUserInfo(userInfo) {
    const queryParams = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userInfo.name,
        about: userInfo.about
      })
    }
    return this._sendQuery('users/me', queryParams);
  }

  patchAvatar(link) {
    const queryParams = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar: link
      })
    }
    return this._sendQuery('users/me/avatar', queryParams);
  }

  postCard(card) {
    const queryParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: card.name,
        link: card.link
      })
    }
    return this._sendQuery('cards', queryParams);
  }

  deleteCard(cardId) {
    const queryParams = {
      method: 'DELETE',
    }
    return this._sendQuery(`cards/${cardId}`, queryParams);
  }

  setStateLike(cardId, isLiked) {
    const method = isLiked ? 'DELETE' : 'PUT';
    const queryParams = {
      method: method,
    }
    return this._sendQuery(`cards/${cardId}/likes`, queryParams);
  }

  signup(userInfo) {
    const queryParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    }
    return this._sendQuery('signup', queryParams)
  }

  signin(userInfo) {
    const queryParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    }
    return this._sendQuery('signin', queryParams)
  }
}

// Инициализация АПИ
const api = new Api({
  baseUrl: 'https://mesto.nshirokov.nomoredomains.rocks/api'
});

export default api;
