const { getAllTopics, articleById } = require("../models/app.model");
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
    res.status(400).send({ msg: "Invalid article ID" });
  }
};

exports.getApi = (req, res) => {
  const endpointsFilePath = path.join(__dirname, "..", "endpoints.json");
  const endpointsData = JSON.parse(fs.readFileSync(endpointsFilePath, "utf8"));
  res.status(200).send(endpointsData);
};
