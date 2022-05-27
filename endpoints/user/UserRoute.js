var express = require('express');
var config = require("config");
var jwt = require('jsonwebtoken');
var jsonParser = express.json();
var router = express.Router();

var userService = require("./UserService");
var authenticationUtils = require("../../utils/AuthenticationUtils");

router.get('/', authenticationUtils.authenticateToken, function (req, res, next) {
    if (req.user && req.user.isAdministrator === true) {
        console.log("Bin in users route");
        userService.getUsers(req.query, function (err, result) {
            console.log("Result: " + result);
            if (err) {
                console.error("Verboten für nicht autorisierte Users.");
                res.json({"Error": "Verboten für nicht autorisierte Users."});
            } else {
                const users = result.map(user => {
                    const { id, userID, userName, isAdministrator, ...partialObject } = user;
                    return { userID, userName, isAdministrator };
                });
                res.json(users);
            }
        })
    } else {
        console.error("Verboten für nicht autorisierte Users.");
        res.status(401).json( {"Fehler" : "User ist nicht autorisiert!"} );
    }
})

router.get('/:userID', authenticationUtils.authenticateToken, function (req, res, next) {
    if (req.user && req.user.isAdministrator === true) {
        var searedUserID = req.params.userID;
        console.log("In Users route.");
        userService.findUserByID(searedUserID, function (err, user) {
            if (err) {
                console.error("Error: " + err);
                res.status(404).json({ "Error": err });
            } else {
                console.log("User wurde gefunden: " + user);
                const { id, userID, userName, isAdministrator, ...partialObject } = user;
                const newUser =  { userID, userName, isAdministrator };               
                res.status(200).send(newUser);
            }
        });
    } else {
        logger.error("Verboten für nicht autorisierte Users.");
        res.status(401).json( {"Fehler" : "User ist nicht autorisiert!"} );
    }
})

router.post('/', authenticationUtils.authenticateToken, function (req, res, next) {

    if (req.user && req.user.isAdministrator === true) {
        console.log("In Users route.");
        userService.createUser(req.body, function (err, user) {
            if (err) {
                console.error("Error: " + err);
                res.status(400).json({ "Error": err });
            } else {
                console.log("User wurde erfolgreich angelegt und gespeichert!");
                const { id, userID, userName, isAdministrator, ...partialObject } = user;
                const newUser =  { userID, userName, isAdministrator };               
                res.status(201).send(newUser);
            }
        });
    } else {
        console.error("Verboten für nicht autorisierte Users.");
        res.status(401).json( {"Fehler" : "User ist nicht autorisiert!"} );
    }
})

router.put('/:userID', authenticationUtils.authenticateToken, jsonParser, function (req, res, next) {
    if (req.user && req.user.isAdministrator === true) {
        console.log("In Users route.");
        userService.updateUserByID(req.params.userID, req.body, function (err, user) {
            if (err) {
                console.error("Error: " + err);
                res.status(400).send("Error: " + err);
            } else {
                console.log("Changes are saved!")
                const { id, userID, userName, isAdministrator, ...partialObject } = user;
                const newUser =  { userID, userName, isAdministrator };               
                res.status(201).send(newUser);
            }
        });
    } else {
        console.error("Verboten für nicht autorisierte Users.");
        res.status(401).json( {"Fehler" : "User ist nicht autorisiert!"} );
    }
})

router.delete('/:userID', authenticationUtils.authenticateToken, function (req, res, next) {
    if (req.user && req.user.isAdministrator === true) {
        console.log("In Users route.");
        const { userID } = req.params;
        userService.removeUserByID(userID, function (err, user) {
            if (err) {
                console.error("Error: " + err);
                res.status(404).send("Error: User has not been found.");
            } else {
                const { id, userID, userName, isAdministrator, ...partialObject } = user;
                const newUser =  { userID, userName, isAdministrator };               
                res.status(200).send(newUser);
            }
        });
    } else {
        console.error("Verboten für nicht autorisierte Users.");
        res.status(401).json( {"Fehler" : "User ist nicht autorisiert!"} );
    }
})

module.exports = router;