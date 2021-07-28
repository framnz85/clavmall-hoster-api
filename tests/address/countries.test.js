const request = require("supertest");
const ObjectId = require("mongoose").Types.ObjectId;
const { Countries } = require("../../src/models/address/countries");
const { Users } = require("../../src/models/allusers/hostusers");

let server;

describe("/address/country", () => {
  beforeEach(() => {
    server = require("../../hoster");
  });
  afterEach(async () => {
    await Countries.remove({});
    await Users.remove({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return all countries", async () => {
      Countries.collection.insertMany([
        { name: "country1", countryCode: "c1", currency: "CO1" },
        { name: "country2", countryCode: "c2", currency: "CO2" },
      ]);

      const res = await request(server).get("/address/country");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.name === "country1")).toBeTruthy();
      expect(res.body.some((c) => c.name === "country2")).toBeTruthy();
    });
  });

  describe("POST /", () => {
    let token;
    let res;

    const response = async (req) => {
      return await request(server)
        .post("/address/country")
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
        .post("/address/country")
        .send({ name: "country1" });

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not admin", async () => {
      token = new Users().generateAuthToken();

      res = await request(server)
        .post("/address/country")
        .set("x-auth-token", token)
        .send({ name: "country1" });

      expect(res.status).toBe(403);
    });

    it("should return 400 if country is less than 2 or more than 255 character", async () => {
      const name = new Array(257).join("a");

      res = await response({
        name: "c",
        countryCode: "co",
        currency: "COU",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: name,
        countryCode: "co",
        currency: "COU",
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 if countryCode is less than 2 or more than 3 character", async () => {
      res = await response({
        name: "country",
        countryCode: "c",
        currency: "COU",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: "country",
        countryCode: "coun",
        currency: "COU",
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 if currency is not 3 character", async () => {
      res = await response({
        name: "country",
        countryCode: "co",
        currency: "CO",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: "country",
        countryCode: "co",
        currency: "COUN",
      });

      expect(res.status).toBe(400);
    });

    it("should save and return the country if it is valid", async () => {
      res = await response({
        name: "country1",
        countryCode: "c1",
        currency: "CO1",
      });

      const countries = await Countries.find({ name: "country1" });

      expect(res.status).toBe(200);
      expect(countries).not.toBeNull();
      expect(countries[0]).toHaveProperty("_id");
      expect(countries[0]).toHaveProperty("name", "country1");
      expect(countries[0]).toHaveProperty("countryCode", "c1");
      expect(countries[0]).toHaveProperty("currency", "CO1");
    });
  });

  describe("PUT /", () => {
    let token;
    let res;
    let couid;

    const response = async (req, id) => {
      return await request(server)
        .put("/address/country/" + id)
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
        .put("/address/country/1")
        .send({ name: "country1" });

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not an admin", async () => {
      token = new Users().generateAuthToken();

      res = await response({ name: "country1" });

      expect(res.status).toBe(403);
    });

    it("should return 400 if country is less than 2 or more than 255 character", async () => {
      const name = new Array(257).join("a");

      res = await response(
        {
          name: "c",
          countryCode: "co",
          currency: "COU",
        },
        couid
      );

      expect(res.status).toBe(400);

      res = await response(
        {
          name: name,
          countryCode: "co",
          currency: "COU",
        },
        couid
      );

      expect(res.status).toBe(400);
    });

    it("should return 400 if countryCode is less than 2 or more than 3 character", async () => {
      let res = await response({
        name: "country",
        countryCode: "c",
        currency: "COU",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: "country",
        countryCode: "coun",
        currency: "COU",
      });

      expect(res.status).toBe(400);
    });

    it("should return 400 if currency is not 3 character", async () => {
      let res = await response({
        name: "country",
        countryCode: "co",
        currency: "CO",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: "country",
        countryCode: "co",
        currency: "COUN",
      });

      expect(res.status).toBe(400);
    });

    it("should return 404 if couid is not a valid ObjectId", async () => {
      couid = 1;

      res = await response(
        {
          name: "country",
          countryCode: "co",
          currency: "COU",
        },
        couid
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${couid} is not a valid ObjectId`);
    });

    it("should return 404 if no country found", async () => {
      couid = ObjectId();

      const res = await response(
        {
          name: "country2",
          countryCode: "c2",
          currency: "CO2",
        },
        couid
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`No address found on Country ID: ${couid}`);
    });

    it("should save and return the country if it is valid", async () => {
      const country = new Countries({
        name: "country1",
        countryCode: "c1",
        currency: "CO1",
      });

      const result = await country.save();

      couid = result._id;

      const res = await response(
        {
          name: "country2",
          countryCode: "c2",
          currency: "CO2",
        },
        couid
      );

      const newCountry = await Countries.find({ _id: couid });

      expect(res.status).toBe(200);
      expect(newCountry).not.toBeNull();
      expect(newCountry[0]).toHaveProperty("name", "country2");
      expect(newCountry[0]).toHaveProperty("countryCode", "c2");
      expect(newCountry[0]).toHaveProperty("currency", "CO2");
    });
  });

  describe("DELETE /", () => {
    let token;
    let res;
    let couid;

    const response = async (id) => {
      return await request(server)
        .delete("/address/country/" + id)
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
      res = await request(server).delete("/address/country/1");

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not an admin", async () => {
      token = new Users().generateAuthToken();

      res = await response();

      expect(res.status).toBe(403);
    });

    it("should return 404 if couid is not a valid ObjectId", async () => {
      couid = 1;

      res = await response(couid);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${couid} is not a valid ObjectId`);
    });

    it("should return 404 if no country found", async () => {
      couid = ObjectId();

      const res = await response(couid);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`No address found on Country ID: ${couid}`);
    });

    it("should save and return the country if it is valid", async () => {
      const country = new Countries({
        name: "country1",
        countryCode: "c1",
        currency: "CO1",
      });

      const result = await country.save();

      couid = result._id;

      const res = await response(couid);

      const newCountry = await Countries.find({ _id: couid });

      expect(res.status).toBe(200);
      expect(newCountry).toHaveLength(0);
    });
  });
});
