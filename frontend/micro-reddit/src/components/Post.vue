<template>
  <div class="post">
    <div class="header">
      <div class="titleBar">
        <div class="title">{{ post.title }} # {{ post.id }}</div>
        <div class="vote">
          <div class="votes">{{ votes }}</div>
          <div>
            <i
              @click="upVote"
              class="like bi bi-hand-thumbs-up-fill"
              v-bind:class="voteClass('like')"
            ></i>
            <i
              @click="downVote"
              class="dislike bi bi-hand-thumbs-down-fill"
              v-bind:class="voteClass('dislike')"
            ></i>
          </div>
        </div>
      </div>

      <div class="auth">Autor: {{ post.author }}</div>
    </div>
    <div class="details">
      <div class="subreddit">
        Subreddit:
        <router-link :to="{ path: `/r/${post.subreddit}` }"
          >{{ post.subreddit }}
        </router-link>
      </div>
      <div class="date">
        {{ post.creationDate }}
      </div>
    </div>
    <div class="image" v-if="post.imagePath && post.imagePath !== ''">
      <img :src="post.imagePath" />
    </div>
    <div class="content"><span v-html="post.content"></span></div>
    <div class="video" v-if="post.videoUrl">
      <iframe width="640" height="360" :src="post.videoUrl" />
    </div>
    <router-link
      class="w-100 btn btn-primary mt-2"
      v-if="showCommentsLink"
      :to="`/post/${post.id}`"
    >
      Komentarze</router-link
    >
  </div>
</template>

<script>
import {
  getPostVotesById,
  hasUserVotedAlready,
  // parsePosts,
  // voteForPost,
} from "../service/post";

export default {
  name: "Post",
  inject: ["io"],
  data() {
    return {
      id: this.post.id || this.$route.params.id,
      votes: 0,
      myVote: "none",
      showDelete: this.initShowDelete,
    };
  },
  computed: {
    showCommentsLink() {
      return this.$route.path !== `/post/${this.post.id}`;
    },
  },
  methods: {
    voteClass(type) {
      if (this.myVote === "none") {
        return "";
      }

      if (this.myVote === "upvote" && type === "like") {
        return "liked";
      } else if (this.myVote === "downvote" && type === "dislike") {
        return "disliked";
      } else {
        return "";
      }
    },
    async getVotes() {
      let req = await getPostVotesById(this.id);

      if (req.status === 200) {
        this.votes = req.data;
      }
    },
    async hasVoted() {
      let req = await hasUserVotedAlready(this.id);

      if (req.status === 200) {
        this.myVote = req.data;
      }
    },
    upVote() {
      console.log(this.$io);
      console.log("Fired");
      this.io.emit("UPDATE_VOTES", {
        postId: this.id,
        vote: 1,
        userId: localStorage.getItem("id"),
      });
    },
    downVote() {
      this.io.emit("UPDATE_VOTES", {
        postId: this.id,
        vote: -1,
        userId: localStorage.getItem("id"),
      });
    },
  },
  async mounted() {
    await this.getVotes();
    await this.hasVoted();
  },
  created() {
    this.io.on("MESSAGE_UPDATE_VOTES", (data) => {
      console.log(data);
      const { updatedSum } = data;

      this.votes = updatedSum;
    });
  },
  props: {
    post: { type: Object, required: true },
  },
};
</script>

<style lang="scss" scoped>
.post {
  width: 80%;
  min-width: 200px;
  margin: 20px 0px;
  padding: 20px;
  border: black 2px solid;
  background: lightgray;
  border-radius: 10px;

  .titleBar {
    display: flex;
    flex-direction: row;
    font-size: 36px;
    .title {
      flex-grow: 1;
    }
  }
  .header {
    display: flex;
    flex-direction: column;
  }
  .content {
    margin: 20px 0px;
  }
  .image {
    display: flex;
    justify-content: center;
    img {
      width: 50%;
      height: 50%;
    }
  }
  .video {
    display: flex;
    justify-content: center;
  }
  .vote {
    display: flex;
  }
}

.like {
  color: gray;
  &:hover {
    color: limegreen;
    transition: 0.5s ease-out;
    cursor: pointer;
  }
}
.dislike {
  color: gray;
  &:hover {
    color: red;
    transition: 0.5s ease-out;
    cursor: pointer;
  }
}

.liked {
  color: limegreen;
  &:hover {
    cursor: default;
  }
}

.disliked {
  color: red;
  &:hover {
    cursor: default;
  }
}

.votes {
  margin-right: 5px;
}
</style>
