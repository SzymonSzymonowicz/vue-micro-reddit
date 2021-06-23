import axios from "axios";
// axios.defaults.withCredentials = true;

const basePath = "/api";
const logError = (err) => console.log(err);

const checkUniqueEmail = (email) =>
  axios
    .get(`${basePath}/account/unique?email=${email}`, {
      withCredentials: true,
    })
    .catch(logError);

const registerAccount = (user) =>
  axios.post(`${basePath}/register`, user).catch(logError);

const login = (user) =>
  axios.post(`${basePath}/login`, user, {
    withCredentials: true,
  });

const logoutUser = () =>
  axios.post(`${basePath}/logout`, {}, { withCredentials: true });

const getAccount = () =>
  axios.get(`${basePath}/account`, {
    withCredentials: true,
  });

const updateAccount = (user) =>
  axios.put("/api/account", user, {
    withCredentials: true,
  });

export {
  checkUniqueEmail,
  registerAccount,
  login,
  logoutUser,
  updateAccount,
  getAccount,
};
