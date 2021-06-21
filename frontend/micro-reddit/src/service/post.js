import axios from "axios";

const basePath = "http://localhost:5000/api";
const logError = (err) => console.log(err);

const getMyPosts = (sortBy) =>
  axios
    .get(`${basePath}/posts/my?sortBy=${sortBy ? sortBy : ""}`, {
      withCredentials: true,
    })
    .catch(logError);

const getPostVotesById = (id) =>
  axios
    .get(`${basePath}/posts/${id}/votes`, {
      withCredentials: true,
    })
    .catch(logError);

const hasUserVotedAlready = (id) =>
  axios
    .get(`${basePath}/posts/${id}/has-voted`, {
      withCredentials: true,
    })
    .catch(logError);

const voteForPost = (id, vote) =>
  axios
    .post(
      `${basePath}/posts/${id}/votes`,
      { vote },
      {
        withCredentials: true,
      }
    )
    .catch(logError);

const searchPostsByContent = (content) =>
  axios
    .get(`${basePath}/posts/search?content=${content}`, {
      withCredentials: true,
    })
    .catch(logError);

const parsePosts = (posts) => {
  const regex = /watch\?v=/;

  return posts.map((post) => {
    let { videoUrl, creationDate, ...rest } = post;

    videoUrl = videoUrl?.replace(regex, "embed/");
    creationDate = new Date(creationDate).toLocaleString();

    return { videoUrl, creationDate, ...rest };
  });
};

export {
  getMyPosts,
  getPostVotesById,
  hasUserVotedAlready,
  voteForPost,
  parsePosts,
  searchPostsByContent,
};
