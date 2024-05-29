const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");
const fs = require("fs");
const path = require("path");
const { title } = require("process");

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
        console.log(body);
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
  test("GET:404 Responds with a 404 error message for incorrect article_id format ", () => {
    return request(app)
      .get("/api/articles/six")
      .expect(400)
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
