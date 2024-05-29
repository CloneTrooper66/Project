const express = require("express");
const { getTopic } = require("./controllers/app.controller");
const { getApi } = require("./controllers/app.controller");
const app = express();

app.get("/api/topics", getTopic);

app.get("/api", getApi);

app.use((req, res, next) => {
  res.status(404).send({ msg: "PATH NOT FOUND" });
  next();
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
