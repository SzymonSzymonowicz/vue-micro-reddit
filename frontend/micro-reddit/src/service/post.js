import axios from "axios";

const basePath = "http://localhost:5000/api";
const logError = (err) => console.log(err);

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
  const ytRegex = /watch\?v=/;
  const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/g;

  return posts.map((post) => {
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
  });
};

export {
  getMyPosts,
  getPostVotesById,
  hasUserVotedAlready,
  voteForPost,
  parsePosts,
  searchPostsByContent,
  newPost,
};
