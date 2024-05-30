const db = require("../db/connection");

function isValidArticleId(articleId) {
  return !isNaN(parseInt(articleId));
}

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
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return result.rows[0];
  });
};

exports.getAllArticles = () => {
  const query = `
   SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM 
      articles
    LEFT JOIN 
      comments
    ON 
      articles.article_id = comments.article_id
    GROUP BY 
      articles.article_id
    ORDER BY 
      articles.created_at DESC;`;

  return db.query(query).then((result) => {
    return result.rows;
  });
};

exports.getAllComments = (articleId) => {
  const query = `
        SELECT 
            comment_id,
            votes,
            created_at,
            author,
            body,
            article_id
        FROM 
            comments
        WHERE 
            article_id = $1
        ORDER BY 
            created_at DESC;
    `;
  if (isValidArticleId(articleId)) {
    return db.query(query, [articleId]).then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Invalid article ID" });
      }
      return result.rows;
    });
  } else {
    return Promise.reject({ status: 404, msg: "article_id must be a number" });
  }
};

exports.insertComment = (article_id, username, body) => {
  const query = `
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  if (isValidArticleId(article_id)) {
    const values = [body, article_id, username];
    return db.query(query, values).then((result) => {
      return result.rows[0];
    });
  } else {
    return Promise.reject({ status: 404, msg: "article_id must be a number" });
  }
};

exports.updateVote = (article_id, vote) => {
  const queryText = `
UPDATE articles
SET votes = votes + $1
WHERE article_id = $2
RETURNING *;
`;
  if (isValidArticleId(article_id)) {
    if (typeof vote !== "number") {
      return Promise.reject({ status: 404, msg: "inc_votes must be a number" });
    }
    const values = [vote, article_id];
    return db.query(queryText, values).then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Invalid article ID" });
      }
      return result.rows[0];
    });
  } else {
    return Promise.reject({ status: 404, msg: "article_id must be a number" });
  }
};

exports.deleteCommentById = (comment_id) => {
  const queryText = ` DELETE FROM comments WHERE comment_id = $1; `;
  if (isValidArticleId(comment_id)) {
    const values = [comment_id];
    return db.query(queryText, values).then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Invalid comment_id" });
      }
    });
  } else {
    return Promise.reject({ status: 404, msg: "comment_id must be a number" });
  }
};
