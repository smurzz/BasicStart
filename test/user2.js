let User = require('../endpoints/user/UserModel');

let chai = require("chai");
let chaiHttp = require("chai-http");

let serverUser = require("../endpoints/user/UserRoute");
let serverForum = require("../endpoints/ForumThread/ForumThreadRoute");
let serverAuth = require("../endpoints/authentication/AuthenticationRoute");

var sessionAuthService = require('../endpoints/authentication/AuthenticationService');
var sessionUserService = require('../endpoints/user/UserService');


// Assertion Style
chai.should();

chai.use(chaiHttp);

describe('ForumThreads', () =>{
    var admin = new User ({"userID": "admin", "password": "123", "isAdministator": true});
    var tokenAdmin;

    before(function(done) {
        sessionAuthService.createSessionToken(admin, function(err, token, user){
            token.should.to.be.a('string');
            tokenAdmin = token;
            user.should.to.be.an('object');
            if(user){
                user.userID.should.to.equal('admin');
            }
            done();
        });
    })

    /* Test the GET route */
    it("It should GET all the forums", function(done){

        chai.request(serverForum)
                .get("/")
                .end((err, response) =>{
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    // response.body.length.should.be.eq(1);
                done();
                })
    })

    /* Test the GET (by ID) route */
    
    /* Test the POST route */
    
    /* Test the PUT route */

    /* Test the DELETE route */

});


// describe('Users', () =>{
//     var admin = new User ({"userID": "admin", "password": "123", "isAdministator": true});
//     var tokenAdmin;

//     before(function(done) {
//         sessionAuthService.createSessionToken(admin, function(err, token, user){
//             // should.have.status(200);
//             token.should.to.be.a('string');
//             tokenAdmin = token;
//             user.should.to.be.an('object');
//             if(user){
//                 user.userID.should.to.equal('admin');
//             }
//             done();
//         });
//     })

//     /* Test the GET route */
//     it("It should GET all the users", function(done){

//         chai.request(serverUser)
//                 .get("/")
//                 .set({Authorization: `Bearer ${tokenAdmin}`})
//                 .end((err, response) =>{
//                     response.should.have.status(200);
//                     response.body.should.be.a('array');
//                     // response.body.length.should.be.eq(1);
//                 done();
//                 })
//     })

//     /* Test the GET (by ID) route */
    
//     /* Test the POST route */
    
//     /* Test the PUT route */

//     /* Test the DELETE route */

// });