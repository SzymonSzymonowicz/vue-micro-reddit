import axios from "axios";

const basePath = "http://localhost:5000/api";
const logError = (err) => console.log(err);

const getMyPosts = () =>
  axios
    .get(`${basePath}/posts/my`, {
      withCredentials: true,
    })
    .catch(logError);

export { getMyPosts };
