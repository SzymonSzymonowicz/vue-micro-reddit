import axios from "axios";

const basePath = "http://localhost:5000/api";
const logError = (err) => console.log(err);

const joinSubreddit = (subredditId) =>
  axios
    .post(
      `${basePath}/subreddits/${subredditId}/join`,
      {},
      {
        withCredentials: true,
      }
    )
    .catch(logError);

export { joinSubreddit };
