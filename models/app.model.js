const db = require("../db/connection");

exports.getAllTopics = () => {
  let queryStr = "SELECT * FROM topics";

  queryStr += ";";
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};
