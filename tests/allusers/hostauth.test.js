const request = require("supertest");
const ObjectId = require("mongoose").Types.ObjectId;
const { Users } = require("../../src/models/allusers/hostusers");
const bcrypt = require("bcrypt");

let server;

describe("/allusers/hostauth", () => {
  beforeEach(() => {
    server = require("../../hoster");
  });
  afterEach(async () => {
    await Users.remove({});
    await server.close();
  });

  describe("POST /", () => {
    let token;
    let res;

    const response = async (req) => {
      return await request(server).post("/allusers/hostauth").send(req);
    };

    it("should return 400 if email is less than 5 or more than 255 character", async () => {
      const email = new Array(257).join("a");

      res = await response({
        email: "user",
        password: "123456",
      });

      expect(res.status).toBe(400);

      res = await response({
        email: email,
        password: "123456",
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 if password is less than 5 or more than 1024 characte", async () => {
      const password = new Array(1026).join("a");

      res = await response({
        email: "username1@sample.com",
        password: "1234",
      });

      expect(res.status).toBe(400);

      res = await response({
        email: "username1@sample.com",
        password: password,
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
      const user = new Users({
        name: "username1",
        email: "username1@sample.com",
        password: "123456",
      });
      await user.save();

      res = await response({
        email: "username2@sample.com",
        password: "123456",
      });

      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email or password");
    });

    it("should return 400 if password is incorrect", async () => {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("123456", salt);

      const user = new Users({
        name: "username1",
        email: "username1@sample.com",
        password: password,
      });
      await user.save();

      res = await response({
        email: "username1@sample.com",
        password: "987654",
      });

      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email or password");
    });

    it("should save and return the user if user email and password is valid", async () => {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("123456", salt);

      const user = new Users({
        name: "username1",
        email: "username1@sample.com",
        password: password,
      });
      await user.save();

      res = await response({
        email: "username1@sample.com",
        password: "123456",
      });

      expect(res.status).toBe(200);
      expect(res.text).not.toBeNull();
      expect(res.text.length).toBeGreaterThan(0);
    });
  });
});
