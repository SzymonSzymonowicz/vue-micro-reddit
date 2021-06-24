import axios from "axios";

// const basePath = "/api";
const basePath = process.env.VUE_APP_BACKEND_URL;
const logError = (err) => console.log(err);

const uploadImage = (formData) =>
  axios.post(`${basePath}/upload`, formData, {
    withCredentials: true,
  });

const newPost = (title, content, imagePath, videoUrl, subredditId) =>
  axios
    .post(
      `${basePath}/posts`,
      { title, content, imagePath, videoUrl, subredditId },
      {
        withCredentials: true,
      }
    )
    .catch(logError);

const getMyPosts = (sortBy) =>
  axios
    .get(`${basePath}/posts/my?sortBy=${sortBy ? sortBy : ""}`, {
      withCredentials: true,
    })
    .catch(logError);

const getPostVotesById = (id) =>
  axios
    .get(`${basePath}/posts/${id}/votes/sum`, {
      withCredentials: true,
    })
    .catch(logError);

const hasUserVotedAlready = (id) =>
  axios
    .get(`${basePath}/posts/${id}/my-vote`, {
      withCredentials: true,
    })
    .catch(logError);

const getPostById = (id) =>
  axios
    .get(`${basePath}/posts/${id}`, {
      withCredentials: true,
    })
    .catch(logError);

const getPostComments = (id) =>
  axios
    .get(`${basePath}/posts/${id}/comments`, {
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

const deletePostById = (id) =>
  axios.delete(`${basePath}/posts/${id}`, {
    withCredentials: true,
  });

const searchPostsByContent = (content) =>
  axios
    .get(`${basePath}/posts/search?content=${content}`, {
      withCredentials: true,
    })
    .catch(logError);

const parseSinglePost = (post) => {
  const ytRegex = /watch\?v=/;
  const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;

  let { videoUrl, creationDate, content, ...rest } = post;

  videoUrl = videoUrl?.replace(ytRegex, "embed/");
  creationDate = new Date(creationDate).toLocaleString();
  content = content
    .split(urlRegex)
    .map((text) =>
      urlRegex.test(text)
        ? `<a href="${text}" target="_blank">${text}</a>`
        : text
    )
    .join("");

  return { videoUrl, creationDate, content, ...rest };
};

const parsePosts = (posts) => {
  return posts.map(parseSinglePost);
};

export {
  uploadImage,
  getMyPosts,
  getPostVotesById,
  hasUserVotedAlready,
  voteForPost,
  parsePosts,
  parseSinglePost,
  searchPostsByContent,
  newPost,
  getPostById,
  getPostComments,
  deletePostById,
};
