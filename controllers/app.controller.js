const {
  getAllTopics,
  articleById,
  getAllArticles,
  getAllComments,
  insertComment,
} = require("../models/app.model");
const fs = require("fs");
const path = require("path");

exports.getTopic = (req, res, next) => {
  getAllTopics()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByID = (req, res, next) => {
  const validArticleId = !isNaN(parseInt(req.params.article_id));
  if (validArticleId) {
    articleById(req.params.article_id).then((result) => {
      if (result === 0) {
        res.status(404).send({ msg: "Article not found" });
      }
      res.status(200).send(result);
    });
  } else {
    res.status(404).send({ msg: "Invalid article ID" });
  }
};

exports.getArticle = (req, res, next) => {
  getAllArticles()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res) => {
  const endpointsFilePath = path.join(__dirname, "..", "endpoints.json");
  const endpointsData = JSON.parse(fs.readFileSync(endpointsFilePath, "utf8"));
  res.status(200).send(endpointsData);
};

exports.getCommentsByID = (req, res, next) => {
  getAllComments(req.params.article_id).then((result) => {
    if (result === 0) {
      res.status(404).send({ msg: "Invalid article ID" });
    }
    res.status(200).send(result);
  });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: "Username and body are required" });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return res.status(400).send({ msg: "Please Enter Valid Strings" });
  }
  insertComment(article_id, username, body).then((result) => {
    res.status(201).send(result);
  });
};
