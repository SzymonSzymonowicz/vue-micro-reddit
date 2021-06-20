import axios from "axios";

const basePath = "http://localhost:5000/api";
const logError = (err) => console.log(err);

const checkUniqueEmail = (email) =>
  axios
    .get(`${basePath}/account/unique?email=${email}`, {
      withCredentials: true,
    })
    .catch(logError);

const login = (user) =>
  axios
    .post(`${basePath}/login`, user, {
      withCredentials: true,
    })
    .catch(logError);

export { checkUniqueEmail, login };
