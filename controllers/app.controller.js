const { getAllTopics } = require("../models/app.model");
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

exports.getApi = (req, res) => {
  const endpointsFilePath = path.join(__dirname, "..", "endpoints.json");
  const endpointsData = JSON.parse(fs.readFileSync(endpointsFilePath, "utf8"));
  res.status(200).send(endpointsData);
};
