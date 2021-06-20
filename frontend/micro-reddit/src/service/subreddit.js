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

const getSubredditByName = (name) =>
  axios
    .get(`${basePath}/subreddits/${name}`, {
      withCredentials: true,
    })
    .catch((err) => console.log(err));

const getSubredditPostsByName = (name) =>
  axios
    .get(`${basePath}/subreddits/${name}/posts`, {
      withCredentials: true,
    })
    .catch((err) => console.log(err));

const isSubredditModerator = (name) =>
  axios
    .get(`${basePath}/subreddits/${name}/is-moderator`, {
      withCredentials: true,
    })
    .catch((err) => console.log(err));

const isLoggedUserInSubreddit = (name) =>
  axios
    .get(`${basePath}/subreddits/${name}/is-in`, {
      withCredentials: true,
    })
    .catch((err) => console.log(err));

export {
  joinSubreddit,
  getSubredditByName,
  getSubredditPostsByName,
  isSubredditModerator,
  isLoggedUserInSubreddit,
};
