import axios from "axios";

const basePath = "http://localhost:5000/api";
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
