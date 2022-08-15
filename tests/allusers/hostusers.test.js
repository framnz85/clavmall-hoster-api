const request = require("supertest");
const ObjectId = require("mongoose").Types.ObjectId;
const { Users } = require("../../src/models/allusers/hostusers");

let server;

describe("/allusers/hostusers", () => {
  beforeEach(() => {
    server = require("../../hoster");
  });
  afterEach(async () => {
    await Users.remove({});
    await server.close();
  });

  describe("GET /", () => {
    let token;
    let res;

    const response = async () => {
      return await request(server)
        .get("/allusers/hostusers")
        .set("x-auth-token", token);
    };

    beforeEach(() => {
      const user = new Users({
        name: "User1",
        email: "user1@sample.com",
        password: "123456",
        isAdmin: true,
      });

      token = user.generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      res = await request(server).get("/allusers/hostusers");

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not admin", async () => {
      token = new Users().generateAuthToken();

      res = await request(server)
        .get("/allusers/hostusers")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return all users", async () => {
      Users.collection.insertMany([
        {
          name: "username1",
          email: "username1@sample.com",
          password: "123456",
        },
        {
          name: "username2",
          email: "username2@sample.com",
          password: "123456",
        },
      ]);

      res = await response();

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.name === "username1")).toBeTruthy();
      expect(res.body.some((c) => c.name === "username2")).toBeTruthy();
    });
  });

  describe("POST /", () => {
    let token;
    let res;

    const response = async (req) => {
      return await request(server)
        .post("/allusers/hostusers")
        .set("x-auth-token", token)
        .send(req);
    };

    beforeEach(() => {
      const user = new Users({
        name: "User1",
        email: "user1@sample.com",
        password: "123456",
        isAdmin: true,
      });

      token = user.generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      res = await request(server)
        .post("/allusers/hostusers")
        .send({ name: "username1" });

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not admin", async () => {
      token = new Users().generateAuthToken();

      res = await request(server)
        .post("/allusers/hostusers")
        .set("x-auth-token", token)
        .send({ name: "username1" });

      expect(res.status).toBe(403);
    });

    it("should return 400 if name is less than 5 or more than 255 character", async () => {
      const name = new Array(257).join("a");

      res = await response({
        name: "user",
        email: "username1@sample.com",
        password: "123456",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: name,
        email: "username1@sample.com",
        password: "123456",
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is less than 5 or more than 255 character", async () => {
      const email = new Array(257).join("a");

      res = await response({
        name: "username1",
        email: "user",
        password: "123456",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: "username1",
        email: email,
        password: "123456",
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is less than 5 or more than 1024 characte", async () => {
      const password = new Array(1026).join("a");

      res = await response({
        name: "username1",
        email: "username1@sample.com",
        password: "1234",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: "username1",
        email: "username1@sample.com",
        password: password,
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 if email already exist", async () => {
      const reqBody = {
        name: "username1",
        email: "username1@sample.com",
        password: "123456",
      };

      const user = new Users(reqBody);
      await user.save();

      res = await response(reqBody);

      expect(res.status).toBe(400);
      expect(res.text).toBe(`Email: ${reqBody.email} already exist`);
    });

    it("should save and return the user if it is valid", async () => {
      const reqBody = {
        name: "username1",
        email: "username1@sample.com",
        password: "123456",
      };

      res = await response(reqBody);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "username1");
      expect(res.body).toHaveProperty("email", "username1@sample.com");
    });
  });
});
