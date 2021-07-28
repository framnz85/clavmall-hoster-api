const request = require("supertest");
const ObjectId = require("mongoose").Types.ObjectId;
const { Addiv2 } = require("../../src/models/address/addiv2");
const { Users } = require("../../src/models/allusers/hostusers");

let server;
let coucode;

describe("/address/addiv2", () => {
  beforeEach(() => {
    server = require("../../hoster");
  });
  afterEach(async () => {
    await Addiv2(coucode).remove({});
    await Users.remove({});
    await server.close();
  });

  describe("GET /", () => {
    let res;
    let couid;
    let addiv1;

    const response = async (couid, addiv1, coucode) => {
      return await request(server).get(
        "/address/addiv2/" + couid + "/" + addiv1 + "?coucode=" + coucode
      );
    };

    it("should return 404 if couid is not a valid ObjectId", async () => {
      couid = 1;

      res = await response(couid);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${couid} is not a valid ObjectId`);
    });

    it("should return 404 if addiv1 is not a valid ObjectId", async () => {
      couid = ObjectId();
      addiv1 = 1;

      res = await response(couid, addiv1);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${addiv1} is not a valid ObjectId`);
    });

    it("should return 404 if coucode is not a valid code", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      coucode = "";

      res = await response(couid, addiv1, coucode);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`country code: ${coucode} is not valid`);
    });

    it("should return 404 if no address found", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      coucode = "ph";

      res = await response(couid, addiv1, coucode);

      expect(res.status).toBe(404);
      expect(res.text).toBe(
        `No address found on couid: ${couid} with addiv1: ${addiv1}`
      );
    });

    it("should return all addiv1", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      coucode = "ph";

      Addiv2(coucode).collection.insertOne({
        name: "adDivName2",
        couid: couid,
        adDivId1: addiv1,
      });

      res = await response(couid, addiv1, coucode);

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("_id");
      expect(res.body[0]).toHaveProperty("name", "adDivName2");
    });
  });

  describe("POST /", () => {
    let token;
    let res;
    let couid;
    let addiv1;

    const response = async (req, couid, addiv1, coucode) => {
      return await request(server)
        .post("/address/addiv2/" + couid + "/" + addiv1 + "?coucode=" + coucode)
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
      res = await request(server).post("/address/addiv2/1/1");

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not admin", async () => {
      token = new Users().generateAuthToken();

      res = await request(server)
        .post("/address/addiv2/1/1")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return 400 if name is less than 2 or more than 255 character", async () => {
      const name = new Array(257).join("a");

      res = await response({
        name: "a",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: name,
      });

      expect(res.status).toBe(400);
    });

    it("should return 404 if couid is not a valid ObjectId", async () => {
      couid = 1;

      res = await response(
        {
          name: "adDivName2",
        },
        couid
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${couid} is not a valid ObjectId`);
    });

    it("should return 404 if addiv1 is not a valid ObjectId", async () => {
      couid = ObjectId();
      addiv1 = 1;

      res = await response(
        {
          name: "adDivName2",
        },
        couid,
        addiv1
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${addiv1} is not a valid ObjectId`);
    });

    it("should return 404 if coucode is not a valid code", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      coucode = "";

      res = await response(
        {
          name: "adDivName1",
        },
        couid,
        addiv1,
        coucode
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`country code: ${coucode} is not valid`);
    });

    it("should save and return the addiv2 if it is valid", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      coucode = "ph";

      res = await response(
        {
          name: "adDivName2",
        },
        couid,
        addiv1,
        coucode
      );

      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty("_id");
      expect(res.body[0]).toHaveProperty("couid", couid.toString());
      expect(res.body[0]).toHaveProperty("adDivId1", addiv1.toString());
      expect(res.body[0]).toHaveProperty("name", "adDivName2");
    });
  });

  describe("PUT /", () => {
    let token;
    let res;
    let couid;
    let addiv1;
    let addiv2;

    const response = async (req, couid, addiv1, addiv2, coucode) => {
      return await request(server)
        .put(
          "/address/addiv2/" +
            couid +
            "/" +
            addiv1 +
            "/" +
            addiv2 +
            "?coucode=" +
            coucode
        )
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
      res = await request(server).put("/address/addiv2/1/1/1");

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not admin", async () => {
      token = new Users().generateAuthToken();

      res = await request(server)
        .put("/address/addiv2/1/1/1")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return 400 if name is less than 2 or more than 255 character", async () => {
      const name = new Array(257).join("a");

      res = await response({
        name: "a",
      });

      expect(res.status).toBe(400);

      res = await response({
        name: name,
      });

      expect(res.status).toBe(400);
    });

    it("should return 404 if couid is not a valid ObjectId", async () => {
      couid = 1;

      res = await response(
        {
          name: "adDivName1",
        },
        couid
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${couid} is not a valid ObjectId`);
    });

    it("should return 404 if addiv1 is not a valid ObjectId", async () => {
      couid = ObjectId();
      addiv1 = 1;

      res = await response(
        {
          name: "adDivName1",
        },
        couid,
        addiv1
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${addiv1} is not a valid ObjectId`);
    });

    it("should return 404 if addiv1 is not a valid ObjectId", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      addiv2 = 1;

      res = await response(
        {
          name: "adDivName1",
        },
        couid,
        addiv1,
        addiv2
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${addiv2} is not a valid ObjectId`);
    });

    it("should return 404 if coucode is not a valid code", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      addiv2 = ObjectId();
      coucode = "";

      res = await response(
        {
          name: "adDivName1",
        },
        couid,
        addiv1,
        addiv2,
        coucode
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(`country code: ${coucode} is not valid`);
    });

    it("should return 404 if no addiv2 found", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      addiv2 = ObjectId();
      coucode = "ph";

      const res = await response(
        {
          name: "adDivName1",
        },
        couid,
        addiv1,
        addiv2,
        coucode
      );

      expect(res.status).toBe(404);
      expect(res.text).toBe(
        `No address found on couid: ${couid} with addiv1: ${addiv1} and addiv2: ${addiv2}`
      );
    });

    it("should save and return the addiv1 if it is valid", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      coucode = "ph";

      Addiv2(coucode).collection.insertOne({
        couid: couid,
        adDivId1: addiv1,
        name: "oldAdDivName2",
      });

      adDivList2 = await Addiv2(coucode).find({});

      addiv2 = new ObjectId(adDivList2[0]._id);

      res = await response(
        {
          name: "newAdDivName2",
        },
        couid,
        addiv1,
        addiv2,
        coucode
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "newAdDivName2");
    });
  });

  describe("DELETE /", () => {
    let token;
    let res;
    let couid;
    let addiv1;

    const response = async (couid, addiv1, addiv2, coucode) => {
      return await request(server)
        .delete(
          "/address/addiv2/" +
            couid +
            "/" +
            addiv1 +
            "/" +
            addiv2 +
            "?coucode=" +
            coucode
        )
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
      res = await request(server).delete("/address/addiv2/1/1/1");

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not admin", async () => {
      token = new Users().generateAuthToken();

      res = await request(server)
        .delete("/address/addiv2/1/1/1")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return 404 if couid is not a valid ObjectId", async () => {
      couid = 1;

      res = await response(couid);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${couid} is not a valid ObjectId`);
    });

    it("should return 404 if addiv1 is not a valid ObjectId", async () => {
      couid = ObjectId();
      addiv1 = 1;

      res = await response(couid, addiv1);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${addiv1} is not a valid ObjectId`);
    });

    it("should return 404 if addiv2 is not a valid ObjectId", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      addiv2 = 1;

      res = await response(couid, addiv1, addiv2);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`id: ${addiv2} is not a valid ObjectId`);
    });

    it("should return 404 if coucode is not a valid code", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      addiv2 = ObjectId();
      coucode = "";

      res = await response(couid, addiv1, addiv2, coucode);

      expect(res.status).toBe(404);
      expect(res.text).toBe(`country code: ${coucode} is not valid`);
    });

    it("should return 404 if no addiv1 found", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      addiv2 = ObjectId();
      coucode = "ph";

      const res = await response(couid, addiv1, addiv2, coucode);

      expect(res.status).toBe(404);
      expect(res.text).toBe(
        `No address found on couid: ${couid} with addiv1: ${addiv1} and addiv2: ${addiv2}`
      );
    });

    it("should save and return the addiv1 if it is valid", async () => {
      couid = ObjectId();
      addiv1 = ObjectId();
      coucode = "ph";

      Addiv2(coucode).collection.insertOne({
        couid: couid,
        adDivId1: addiv1,
        name: "oldAdDivName2",
      });

      adDivList2 = await Addiv2(coucode).find({});

      addiv2 = new ObjectId(adDivList2[0]._id);

      res = await response(couid, addiv1, addiv2, coucode);

      adDivList2 = await Addiv2(coucode).find({});

      expect(res.status).toBe(200);
      expect(adDivList2.length).toBe(0);
    });
  });
});
