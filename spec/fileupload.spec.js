const request = require("request");
const should = require("should")
const routes = require("../routes");
const boundary = Math.random();

const base_url = "http://localhost:3000";

describe("Routing", () => {

  describe("Default Route", () => {
    it("should provide the a title and the index view name", done => {
      routes.index({}, {
        render: (viewName) => {
          viewName.should.equal("index")
          done();
        }
      })
    })
  })

  describe("POST /fileupload", () => {
    it("returns success response (200) and uploading file which finds the failed transaction records", done => {
      request.post(base_url + '/fileupload', (error, response, body) => {
        expect(200)
        expect('Content-Type', 'text/html; charset=utf-8') // encoded content
        expect('Content-Type', 'multipart/form-data; boundary=' + boundary)
        expect('name', 'uploadedFile')
        end((err, res) => {
          if (err) return done(err);
          expect(body).toBe([res.body]);
          done();
        })
      });
    });
  });
});
