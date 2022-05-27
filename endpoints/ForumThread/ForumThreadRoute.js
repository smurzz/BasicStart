var express = require('express');
var config = require("config");
var jwt = require('jsonwebtoken');

var router = express.Router();
var jsonParser = express.json();

var logger = require('../../config/winston');
var forumService = require("../ForumThread/ForumThreadService");
var authenticationUtils = require("../../utils/AuthenticationUtils");

router.get('/', function (req, res, next) {
    console.log("In Forums route.");
    forumService.findForums(req.query, function (err, result) {
        if (err) {
            res.status(404).json({ "Error": err });
        } else {
            console.log("Result " + result);
            res.send(result);
        }
    })
})

router.get('/myForumThreads', authenticationUtils.authenticateToken, function (req, res, next) {
    forumService.findMyForums(req.user.userID, function (err, result) {
        console.log("In Forums route.");
        if (err) {
            res.status(404).json({ "Error": err });
        } else {
            console.log("Ergebnis: " + result);
            res.send(result);
        }
    });
})

router.get('/:_id', function (req, res, next) {
    const { _id } = req.params;
    forumService.findForumByID(_id, function (err, forum) {
        if (err) {
            res.status(404).json({ "Fehler": err });
        } else {
            res.status(200).send(forum);
        }
    });
})

router.get('/:_id/forumMessages', function (req, res, next) {
    const { _id } = req.params;
    forumService.findForumMessages(_id, function (err, forum) {
        if (err) {
            res.status(404).json({ "Fehler": err });
        } else {
            res.status(200).send(forum);
        }
    });
})

router.put('/:_id', authenticationUtils.authenticateToken, function (req, res, next) {
    const { _id } = req.params;
    forumService.updateForumByID(_id, req.body, req.user.userID, function (err, forum) {
        if (err) {
            res.status(400).json({ "Error": err });
        } else {
            res.status(200).send(forum);
        }
    });
})

router.post('/', authenticationUtils.authenticateToken, function (req, res, next) {
    forumService.createForum(req.body, req.user.userID, function (err, forum) {
        if (err) {
            res.status(400).json({ "Error": err });
        } else {
            console.log("Ein neues Forum wurde erstellt.");
            res.status(201).send(forum);
        }
    });
})

router.delete('/:_id', authenticationUtils.authenticateToken, function(req, res, next){
    const { _id } = req.params;
    forumService.removeForum(_id, req.user.userID, function(err, forum){
        if(forum){
            res.status(200).send(forum);
        } else if (err){
            res.status(500).send({ "Fehler": err });
        } else{
            res.status(404).send({ "Fehler": "Forum wurde nicht gefunden." });
        }
    });
})

// find all messages for a forum
router.get('/:_id/forumMessages', function(req, res, next){
    const { _id } = req.params;
    logger.debug("In Messages route.");
    forumService.findForumMessages(_id, function(err, result){
        if(err){
            res.status(404).json({ "Error": err });
        } else {
            res.send(result);
        }
    })
})

module.exports = router;