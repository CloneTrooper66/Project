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
  return db.query(query, [articleId]).then((result) => {
    if (result.rowCount === 0) {
      return result.rowCount;
    }
    return result.rows;
  });
};
