<template>
  <div class="post">
    <div class="header">
      <div class="titleBar">
        <div class="title">{{ post.title }} # {{ post.id }}</div>
        <div class="vote">
          <div>{{ votes }}</div>
          <div v-if="!hasUserVoted">
            <i @click="upVote" class="like bi bi-hand-thumbs-up-fill"></i>
            <i
              @click="downVote"
              class="dislike bi bi-hand-thumbs-down-fill"
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
    <router-link class="w-100 btn btn-primary" :to="`/post/${post.id}`"
      >Z komentarzami</router-link
    >
    <div class="image" v-if="post.imagePath">
      <img :src="post.imagePath" />
    </div>
    <div class="content"><span v-html="post.content"></span></div>
    <div class="video" v-if="post.videoUrl">
      <iframe width="640" height="360" :src="post.videoUrl" />
    </div>
  </div>
</template>

<script>
import {
  getPostVotesById,
  hasUserVotedAlready,
  voteForPost,
} from "../service/post";

export default {
  name: "Post",
  data() {
    return {
      votes: 0,
      hasUserVoted: false,
      showDelete: this.initShowDelete,
    };
  },
  methods: {
    async getVotes() {
      let req = await getPostVotesById(this.post.id);

      if (req.status === 200) {
        this.votes = req.data;
      }
    },
    async hasVoted() {
      let req = await hasUserVotedAlready(this.post.id);

      if (req.status === 200) {
        this.hasUserVoted = req.data;
      }
    },
    async upVote() {
      let req = await voteForPost(this.post.id, 1);

      if (req.status === 200) {
        await this.hasVoted();
        this.getVotes();
      }
    },
    async downVote() {
      let req = await voteForPost(this.post.id, -1);

      if (req.status === 200) {
        await this.hasVoted();
        this.getVotes();
      }
    },
  },
  async mounted() {
    await this.getVotes();
    await this.hasVoted();
  },
  props: {
    post: {},
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
  color: limegreen;
  &:hover {
    color: green;
    transition: 0.5s ease-out;
  }
}
.dislike {
  color: red;
  &:hover {
    color: rgb(165, 8, 8);
    transition: 0.5s ease-out;
  }
}
</style>
