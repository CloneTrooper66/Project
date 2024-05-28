const { getAllTopics } = require("../models/app.model");

exports.getTopic = (req, res, next) => {
  getAllTopics()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
