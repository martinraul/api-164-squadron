const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
const expect = chai.expect;

describe("API Endpoints", () => {
  it("should return an array of pilots from /pilots", (done) => {
    chai
      .request(app)
      .get("/pilots")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should return an array with 77 items", (done) => {
    chai
      .request(app)
      .get("/pilots")
      .end((err, res) => {
         expect(res).to.have.status(200);
        expect(res.body.length).to.equal(77);
        done();
      });
  });

  it('should return a single pilot object from /pilots/:id', (done) => {
    chai.request(app)
      .get('/pilots/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name');
        done();
      });
  });

  it('should return nothing for an invalid id on /pilots/:id', (done) => {
    chai.request(app)
      .get('/pilots/9999')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.empty;
        done();
      });
  });

  it('should return a paginated list of pilots', (done) => {
    chai.request(app)
      .get('/pilots/perpage/5?p=1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('page').equal(1);
        expect(res.body).to.have.property('pageCount');
        expect(res.body).to.have.property('pilots').with.lengthOf(5);
        done();
      });
  });

  it('should load the main page successfully', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('API Information');
        done();
      });
  });
});
