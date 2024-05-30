const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");
const fs = require("fs");
const path = require("path");
const sorted = require("jest-sorted");
afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  test("GET:200 Responds With an array of topic objects each having slug and description property,", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("GET:404 Responds with a 404 error message for  incorrect path", () => {
    return request(app)
      .get("/api/topis")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("PATH NOT FOUND");
      });
  });
});

describe("GET /api", () => {
  test("GET:200 Responds with An object describing all the available endpoints on your API", () => {
    const endpointsFilePath = path.join(__dirname, "..", "endpoints.json");
    const endpointsData = JSON.parse(
      fs.readFileSync(endpointsFilePath, "utf8")
    );
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsData);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:200 Responds with an  article object, which should have appropriate properties: ", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("GET:404 Responds with a 404 error message for incorrect article_id number ", () => {
    return request(app)
      .get("/api/articles/six")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });

  test("GET:404 Responds with a 404 error message when article_id does not match any existing article_id in the database ", () => {
    return request(app)
      .get("/api/articles/300")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 Responds with an articles array of article objects, each of which should have have appropriate properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
        body.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET:404 Responds with a 404 error message for  incorrect path", () => {
    return request(app)
      .get("/api/artcles")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("PATH NOT FOUND");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 Responds with an array of comments for the given article_id of which each comment should have the following properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(2);
        expect(body).toBeSortedBy("created_at", { descending: true });
        body.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 5,
          });
        });
      });
  });
  test("GET:404 Responds with a 404 error message when article_id does not match any existing article_id in the database ", () => {
    return request(app)
      .get("/api/articles/2325/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });
  test("GET:404 Responds with a 404 error message when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/ten/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id must be a number");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST:201 Responds with a newly created comment object", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a test comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((result) => {
        expect(result.body).toMatchObject({
          comment_id: expect.any(Number),
          body: newComment.body,
          article_id: 2,
          author: newComment.username,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("POST 400: Responds with a 400 error message when body or username is missing", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Username and body are required");
      });
  });

  test("POST 400: Responds with a 400 error message when the body or username is not a string.", () => {
    const newComment = {
      username: "butter_bridge",
      body: 23,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please Enter Valid Strings");
      });
  });
  test("GET:404 Responds with a 404 error message when article_id is not a number", () => {
    const newComment = {
      username: "butter_bridge",
      body: 23,
    };
    return request(app)
      .post("/api/articles/zz/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Please Enter Valid Strings");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 should update article votes", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/3")
      .send(vote)
      .expect(200)
      .then((result) => {
        expect(result.body).toMatchObject({
          body: expect.any(String),
          article_id: 3,
          author: expect.any(String),
          votes: 1,
          created_at: expect.any(String),
        });
      });
  });

  test("PATCH:200 should decrement article votes", () => {
    const vote = { inc_votes: -8 };
    return request(app)
      .patch("/api/articles/4")
      .send(vote)
      .expect(200)
      .then((result) => {
        expect(result.body).toMatchObject({
          body: expect.any(String),
          article_id: 4,
          author: expect.any(String),
          votes: -8,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH:404 Responds with a 404 error massage when inc_votes value is not a Number", () => {
    const vote = { inc_votes: "seven" };
    return request(app)
      .patch("/api/articles/4")
      .send(vote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("inc_votes must be a number");
      });
  });
  test("PATCH:404 Responds with a 404 error massage when article_id  is not a Number", () => {
    const vote = { inc_votes: "seven" };
    return request(app)
      .patch("/api/articles/one")
      .send(vote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id must be a number");
      });
  });
  test("Patch:404 Responds with a 404 error message when article_id does not match any existing article_id in the database ", () => {
    const vote = { inc_votes: 4 };
    return request(app)
      .patch("/api/articles/42323")
      .send(vote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article ID");
      });
  });
});

describe("DELETE:200  /api/comments/:comment_id", () => {
  test("DELETE:204 should delete the given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((result) => {
        expect(result.body).toEqual({});
      });
  });
  test("DELETE:404 Responds with a 404 error massage when comment_id  is not a Number", () => {
    return request(app)
      .delete("/api/comments/seven")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id must be a number");
      });
  });
  test("DELETE:404 Responds with a 404 error message when comment_id does not match any existing comment_id in the database", () => {
    return request(app)
      .delete("/api/comments/1222")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid comment_id");
      });
  });
});
