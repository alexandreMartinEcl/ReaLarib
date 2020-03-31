import agent from "superagent";
import localHttp from "./test.http";

/**
 * Cette classe permet de bousculer du mode online à local facilement
 * Chaque requête réalisée dans les .repository passe par ici
 * Si agent.local, cela renvoie aux fonctions ci-dessous renvoyant un exemple donnée de réponse
 * Si agent.online, cela renvoie à superagent
 *  Ce middleware permet l'authentifiation à chaque requête
 */

// Swap base if you want to access online backend with local frontend
// const base = 'http://127.0.0.1:8000';
const base = process.env.BACKEND_BASE_URL;

const TOKEN_KEY = process.env.TOKEN_KEY;

// eslint-disable-next-line no-unused-vars
var token = localStorage.getItem(TOKEN_KEY) || null;

const setToken = (updatedToken) => {
  localStorage.setItem(TOKEN_KEY, updatedToken);
  token = updatedToken;
};

// const deleteToken = () => {
//   localStorage.removeItem(TOKEN_KEY);
//   token = null;
// };

function getTokenHeader() {
  return "JWT " + localStorage.getItem(TOKEN_KEY) || null;
}

function getAuthHeaders() {
  var headers =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.assign({}, headers, { Authorization: getTokenHeader() });
}

const handleResponse = (response) => {
  if (response.token) {
    setToken(response.token);
    token = response.token;
  }
};

function checkAuthResponse(response) {
  return function (err, res) {
    return handleResponse(res).then(function () {
      return response(err, res);
    });
  };
}

const choiceAgent = {
  local: localHttp,
  online: {
    get: (url) => {
      return agent
        .get(base + url)
        .set(getAuthHeaders())
        .catch(checkAuthResponse);
    },
    post: (url) => {
      return {
        send: (params) => {
          return agent
            .post(base + url)
            .set(getAuthHeaders())
            .send(params)
            .catch(checkAuthResponse);
        },
      };
    },
    put: (url) => {
      return {
        send: (params = {}) => {
          return agent
            .put(base + url)
            .set(getAuthHeaders())
            .send(params)
            .catch(checkAuthResponse);
        },
      };
    },
  },
};

export default choiceAgent;
