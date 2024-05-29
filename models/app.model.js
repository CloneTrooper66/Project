const db = require("../db/connection");

exports.getAllTopics = () => {
  let queryStr = "SELECT * FROM topics";

  queryStr += ";";
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.articleById = (articleId) => {
  const query = `
  SELECT
    u.name AS author,
    a.title,
    a.article_id,
    a.body,
    t.slug AS topic,
    a.created_at,
    a.votes,
    a.article_img_url
  FROM articles a
  LEFT JOIN users u ON a.author = u.username
  LEFT JOIN topics t ON a.topic = t.slug
  WHERE a.article_id = $1;
`;

  return db.query(query, [articleId]).then((result) => {
    if (result.rowCount === 0) {
      return result.rowCount;
    }
    return result.rows[0];
  });
};
