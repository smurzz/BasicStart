var userService = require("../user/UserService");

const ForumMessage = require("./ForumMessageModel");
const ForumThread = require("../ForumThread/ForumThreadModel");

// find messages
function findMessages(queryParams, callback) {
    ForumMessage.find(queryParams, function (err, messages) {
        if (err) {
            console.error("Fehler bei Messages-Suche: " + err);
            return callback(err, null);
        } else {
            console.log("Die Suche ist gut gelungen.");
            return callback(null, messages);
        }
    })
}

// find message
function findMessageByID(messageID, callback){
    ForumMessage.findById(messageID, function (err, message) {
        if (message) {
            console.log("Die Suche ist gut gelungen.");
            return callback(null, message);
        } else {
            console.error(`Die Nachricht mit der ID < ${messageID} > ist nicht gefunden.`);
            return callback(`Die Nachricht mit der ID < ${messageID} > ist nicht gefunden.`, null);
        }
    })
}

// create message
function createMessage(params, userID, callback) {
    if (userID) {
        userService.findUserByID(userID, function (err, user) {
            if (err) {
                callback(err, null);
            } else {
                if (!params.forumThreadID) {
                    console.error("ForumThread ID ist nicht gefunden.");
                    callback("ForumThread ID ist nicht gefunden.", null);
                } else {
                    ForumThread.findOne({ _id: params.forumThreadID }, function (err, forum) {
                        if (err) {
                            console.error(`Kein Forum mit Forum-ID < ${params.forumThreadID} > ist gefunden.`);
                            callback(`Kein Forum mit Forum-ID < ${params.forumThreadID} > ist gefunden.`, null);
                        } else {
                            var newMessage = new ForumMessage(params);
                            newMessage.authorID = userID;
                            newMessage.save(function (err) {
                                if (err) {
                                    console.error("Nachricht konnte nicht gespeichert werden: " + err);
                                    callback("Nachricht konnte nicht gespeichert werden", null);
                                } else {
                                    console.log("Nachricht wurde gespeichert.");
                                    callback(null, newMessage);
                                }
                            })
                        }
                    });
                }
            }
        })
    } else {
        console.error("User ID ist nicht angegeben.");
        callback("User ID ist nicht angegeben.", null);
    }
}

// update message
function updateMessageByID(messageID, params, callback){
    if (params && Object.keys(params).length !== 0) {
        if(params.forumThreadID || params.authorID){
            console.error("Weder < forumThreadID > noch < autherID > können geändert werden.");
            callback("Weder < forumThreadID > noch < autherID > können geändert werden.", null);
        } else {
            ForumMessage.findOneAndUpdate({ _id: messageID }, params, function (err, message) {
                if (err) {
                    console.error("Die Änderungen in der Nachricht konnten nicht vorgenommen werden.");
                    callback("Die Änderungen in der Nachricht konnten nicht vorgenommen werden.", null);
                } else {
                    console.log("Die Änderungen wurden erforlgreich in der Nachricht gespeichert.");
                    callback(null, message);
                }
            });
        }
    } else {
        logger.error("Keine Änderungen sind angegeben.");
        callback("Keine Änderungen sind angegeben.", null);
    }
}

// delete forum
function removeMessage(messageID, callback) {
    ForumMessage.findByIdAndDelete({ _id: messageID }, function (err, forum) {
        if (forum) {
            console.log("Nachricht wurde gelöschet.");
            callback(null, forum);
        } else {
            console.error(`Nachricht mit ID < ${messageID} > ist nicht gefunden.`);
            callback(`Nachricht mit ID < ${messageID} > ist nicht gefunden.`, null);
        }
    });
}

module.exports = {
    findMessages,
    findMessageByID,
    createMessage,
    updateMessageByID,
    removeMessage
}