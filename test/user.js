/* let User = require('../endpoints/user/UserModel');
const request = require("supertest");

let expect = require("chai").expect;

let server = require("../endpoints/user/UserRoute");
var sessionService = require('../endpoints/authentication/AuthenticationService');

describe('BasicStart', () =>{
    var admin = new User ({"userID": "admin", "password": "123", "isAdministator": true});
    var tokenAdmin;

    before(function(done) {
        sessionService.createSessionToken(admin, function(err, token, user){
            // expect(err).to.be.a('null');
            expect(token).to.be.a('string');
            tokenAdmin = token;
            expect(user).to.be.an('object');
            if(user){
                expect(user.userID).to.equal('admin');
            }
            done();
        });
    })

    it("It should GET all the users", function(done){
        request(server)
        .get('/')
        .set({Authorization: `Bearer ${tokenAdmin}`})
        .expect(function(err, res){
            expect(res.body).to.be.a('array');
        })
        .end(done);
    })

}); */