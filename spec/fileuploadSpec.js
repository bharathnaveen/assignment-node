const request = require("request");

const base_url = "http://localhost:3000/";

describe("File Upload Server", () => {
  describe("POST /", () => {
    it("returns status code 200", done => {
      request.get(base_url, (error, response, body) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });

    it("returns Transaction Values", done => {
      request.post(base_url, (error, response, body) => {
        expect(body).toBe([]);
        done();
      });
    });
  });
});
