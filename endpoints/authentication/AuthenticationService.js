var userService = require('../user/UserService');
var jwt = require('jsonwebtoken');
var config = require('config');
var logger = require('../../config/winston');

function createSessionToken(user, callback){
    logger.debug("AuthenticationServive: Token erstellen.");

    if (!user) {
        console.error("Kein User für Authentication Token ist angegeben.");
        callback("Kein User für Authentication Token ist angegeben.", null, null);
        return;
    } else {
        userService.authorize(user, function (err, user) {
            if (err) {
                console.error("Authentication ist gescheitert.");
                callback("Authentication ist gescheitert.", null, null);
                return;
            } else {
                var issuedAt = new Date().getTime();
                var expirationTime = config.get('session.timeout');
                var expiresAt = issuedAt + (expirationTime * 1000);
                var privateKey = config.get('session.tokenKey');
                let token = jwt.sign(
                    { 
                        "userID": user.userID, 
                        "userName": user.userName, 
                        "isAdministrator": user.isAdministrator 
                    }, 
                    privateKey, 
                    { 
                        expiresIn: expiresAt, 
                        algorithm: 'HS256' 
                    });
                callback(null, token, user);
            }
        });
    }
};

module.exports = {
    createSessionToken
}
