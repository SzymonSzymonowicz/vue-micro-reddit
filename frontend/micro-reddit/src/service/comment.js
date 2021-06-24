import axios from "axios";

const basePath = "/api";
// const basePath = process.env.VUE_APP_BACKEND_URL;
const logError = (err) => console.log(err);

const deleteCommentById = (id) =>
  axios
    .delete(`${basePath}/comments/${id}`, {
      withCredentials: true,
    })
    .catch(logError);

const postComment = (postId, content) =>
  axios
    .post(
      `${basePath}/posts/${postId}/comments`,
      { content },
      {
        withCredentials: true,
      }
    )
    .catch(logError);

export { deleteCommentById, postComment };
