var express = require('express');
var router = express.Router();

var authenticationService = require('./AuthenticationService')

router.get('/', function (req, res, next) {

    console.log('Wnat to create token');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    if (req.headers.authorization && req.headers.authorization.indexOf('Basic') !== -1) {
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [userID, password] = credentials.split(':');

        const user = { userID, password };
        authenticationService.createSessionToken(user, function (err, token, user) {
            if (token) {
                res.setHeader("Authorization", "Bearer " + token);

                if (user) {
                    console.log("Token created successfully: " + token);
                    res.status(200).json({"Success": "Token created successfully"});
                } else {
                    console.log("User is null, even though a token has been created. Error: " + err);
                    res.status(200).json({"Success": "User is null, even though a token has been created"});
                }
            } else {
                console.log("Token has not been created, Error: " + err);
                res.status(401).json({'Error':'Could not create token'});
            }
        });
    } else {
        console.error("Autorization Header or JSON-Body is missing")
        res.status(401).json({ 'Fehler': 'Autorization Header or JSON-Body is missing' });
       
    }
});

module.exports = router;