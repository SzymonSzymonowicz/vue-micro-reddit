import axios from "axios";

const basePath = "http://localhost:5000/api";
const logError = (err) => console.log(err);

const getMyPosts = (sortBy) =>
  axios
    .get(`${basePath}/posts/my?sortBy=${sortBy ? sortBy : ""}`, {
      withCredentials: true,
    })
    .catch(logError);

export { getMyPosts };
