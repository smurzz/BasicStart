var logger = require("../../config/winston");

var userService = require("../user/UserService");
var forumMessagesService = require("../ForumMessage/ForumMessageService");

const ForumThread = require("./ForumThreadModel");

//find forums
function findForums(queryParameters, callback) {
    console.log(queryParameters);
    ForumThread.find(queryParameters, function (err, forums) {
        if (err) {
            console.error("Fehler bei Forums-Suche: " + err);
            return callback(err, null);
        } else {
            console.log("Die Suche ist gut gelungen.");
            return callback(null, forums);
        }
    });
}

// find forum by ID
function findForumByID(forumID, callback) {
    if (forumID) {
        ForumThread.findById({ _id: forumID }, function (err, forum) {
            if (err) {
                console.error(`Kein Forum mit Forum-ID < ${forumID} > ist gefunden.`);
                callback(`Kein Forum mit Forum-ID < ${forumID} > ist gefunden.`, null);
            } else {
                console.log(); ("Forum ist gefunden.");
                callback(null, forum);
            }
        });
    } else {
        console.error("Keine Forum-ID ist angegeben.");
        callback("Keine Forum-ID ist angegeben.", null);
    }
}

// find messages from a forum by ID
function findForumMessages(forumID, callback) {
    if (forumID) {
        ForumThread.findOne({ _id: forumID }, function (err, forum) {
            if (forum) {
                forumMessagesService.findMessages({ forumThreadID: forumID }, function(err, messages){
                    if (err) {
                        console.error(`Keine Nachrichten mit Forum-ID < ${forumID} > sind gefunden.`);
                        callback(`Keine Nachrichten mit Forum-ID < ${forumID} > sind gefunden.`, null);
                    } else {
                        console.log(); ("Nachrichten sind gefunden.");
                        callback(null, messages);
                    }
                })
            } else {
                console.error(`Kein Forum mit Forum-ID < ${forumID} > ist gefunden.`);
                callback(`Kein Forum mit Forum-ID < ${forumID} > ist gefunden.`, null);
            }
        });
    } else {
        console.error("Keine Forum-ID ist angegeben.");
        callback("Keine Forum-ID ist angegeben.", null);
    }
}

// create new forum
function createForum(params, userID, callback) {
    if (userID) {
        userService.findUserByID(userID, function (err, user) {
            if (err) {
                console.error("Erstellen eines neuen Forum ist gescheitert: " + err);
                callback(err, null);
            } else {
                if (params.ownerID && params.ownerID !== userID) {
                    console.error("Ein Forum kann nur vom angemeldeten User erstellt werden.");
                    callback("Ein Forum kann nur vom angemeldeten User erstellt werden.", null)
                } else {
                    var newForum = new ForumThread(params);
                    newForum.ownerID = userID;
                    newForum.save(function (err) {
                        if (err) {
                            console.error("Forum konnte nicht gespeichert werden: " + err);
                            callback("Forum konnte nicht gespeichert werden", null);
                        } else {
                            console.log("Forum wurde gespeichert.");
                            callback(null, newForum);
                        }
                    });
                }
            }
        });
    } else {
        logger.error("User ID ist nicht angegeben.");
        callback("User ID ist nicht angegeben.", null);
    }
}

// update forum
function updateForumByID(forumID, params, userID, callback) {
    if (forumID) {
        findForumByID(forumID, function (err, forum) {
            if (err) {
                console.error(err);
                callback(err, null);
            } else {
                if (forum.ownerID === userID) {
                    if (params && Object.keys(params).length !== 0) {
                        Object.keys(params).forEach(change => {
                            if (change === 'name') { forum.name = params[change] }
                            if (change === 'description') { forum.description = params[change] }
                        });
                        forum.save(function (err, forum) {
                            if (err) {
                                console.error(err);
                                callback(err, null);
                            } else {
                                console.log("Die Veränderungen wurden erfolgreich gespeichert: " + forum);
                                callback(null, forum);
                            }
                        })
                    } else {
                        console.error("Keine Änderungen sind angegeben.");
                        callback("Keine Änderungen sind angegeben.", null);
                    }
                } else {
                    console.error("Keine Rechte für Aktualisierung des Forums.");
                    callback("Keine Rechte für Aktualisierung des Forums.", null);
                }
            }
        });
    } else {
        console.error("Keine Forum-ID ist angegeben.");
        callback("Keine Forum-ID ist angegeben.", null);
    }
}

// find my forums
function findMyForums(myID, callback) {
    if (myID) {
        console.log(myID);
        var query = ForumThread.find({ ownerID: myID });
        console.log(query.getFilter());
        query.exec(function (err, forums) {
            if (err) {
                console.error("Fehler bei Forums-Suche: " + err);
                return callback(err, null);
            } else {
                console.log("Die Suche ist gut gelungen.");
                return callback(null, forums);
            }
        })
    } else {
        console.error("Kein owerID ist angegeben.");
        callback("Kein owerID ist angegeben.", null);
    }
}

// delete forum
function removeForum(forumID, userID, callback){
    if (forumID) {
        ForumThread.findByIdAndDelete({ _id: forumID }, function(err, forum){
            if(err){
                console.log("Forum wurde nicht gefunden.");
                callback(err, null);
            } else {
                if (forum.ownerID === userID) {
                    console.log("Forum wurde gelöschet.");
                    callback(null, forum);
                } else {
                    console.error("Keine Rechte für Aktualisierung des Forums.");
                    callback("Keine Rechte für Aktualisierung des Forums.", null);
                }
            }
        });
    } else {
        console.error("Keine Forum-ID ist angegeben.");
        callback("Keine Forum-ID ist angegeben.", null);
    }
}

module.exports = {
    createForum,
    findForumByID,
    findForumMessages,
    updateForumByID,
    findMyForums,
    findForums,
    removeForum
}