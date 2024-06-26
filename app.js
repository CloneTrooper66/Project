const express = require("express");
const {
  getTopic,
  getArticleByID,
  getArticle,
  getCommentsByID,
  postComment,
  patchVote,
  deleteComment,
  getUsers,
} = require("./controllers/app.controller");
const { getApi } = require("./controllers/app.controller");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopic);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles", getArticle);

app.get("/api/articles/:article_id/comments", getCommentsByID);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVote);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use((req, res, next) => {
  res.status(404).send({ msg: "PATH NOT FOUND" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: err.message || "Bad Request" });
  } else {
    res.status(err.status || 500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
