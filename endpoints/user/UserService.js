const User = require("./UserModel");
const bcrypt = require('bcrypt');

function getUsers(queryparam, callback) {
    User.find(queryparam, function (err, users) {
        if (err) {
            console.log("Fehler bei Suche: " + err);
            return callback(err, null);
        } else {
            User.findOne({ userID: 'admin'}, function (err, user) {
                if (user) {
                    console.log("Alles super");
                    return callback(null, users);
                } else {
                    console.log('Do not have admin account yet. Create it with default password');
                    var adminUser = new User();
                    adminUser.userID = "admin";
                    adminUser.password = "123";
                    adminUser.userName = "Default Administrator Account";
                    adminUser.isAdministrator = true;
    
                    adminUser.save(function (err) {
                        if (err) {
                            console.error("Could not create default admin account: " + err);
                            callback("Could not login to admin account", null);
                        } else {
                            callback(null, users);
                        }
                    });
                    
                }
            })
        }
    })
}

/*function findUserBy(searchUserID, callback) {

    console.log(`UserService: find User by ID < ${searchUserID} >`);

    if (!searchUserID) {
        callback("UserID is missing");
        return;
    } else {
        var query = User.findOne({ userID: searchUserID });
        query.exec(function (err, user) {
            if (user) {
                console.log(`Found userID: ${searchUserID}`);
                callback(null, user);
            } else {
                console.log(`Did not find user for userID < ${searchUserID} >`);
                return callback(`Did not find user for userID < ${searchUserID} >`, null);
            }
        });
    }
}*/

function findUserByID(searchUserID, callback) {

    console.log("UserService: find User by ID: " + searchUserID);

    if (!searchUserID) {
        callback({ "Fehler": "UserID fehlt." });
        return;
    } else {
        var query = User.findOne({ userID: searchUserID });
        query.exec(function (err, user) {
            if (user) {
                console.log(`Found userID: ${searchUserID}`);
                callback(null, user);
            } else {
                console.log(`Did not find user for userID < ${searchUserID} >`);
                return callback(`Did not find user for userID < ${searchUserID} >`, null);
            }
        })
    }
}

function createUser(newUser, callback) {
    if (!newUser) {
        console.log("Error: have no json body")
        callback("JSON-Boby missing", null)
        return;
    } else {
        // validate attributes
        if (!newUser.userID || typeof newUser.userID !== 'string') {
            return callback(`Eingabetype von < id > ist falsch oder ist nicht angegeben`, null);
        } else if (!newUser.userName || typeof newUser.userName !== 'string' || !newUser.userName.match(/^[a-zA-Z ]*$/)) {
            return callback(`Eingabetype von < name > ist falsch, ist kein Klartext oder nicht angegeben`, null);
        } else if (!newUser.password || typeof newUser.password !== 'string') {
            return callback(`Eingabetype von < password > ist falsch oder ist nicht angegeben`, null);
        } else if (newUser.isAdministrator && typeof newUser.isAdministrator !== 'boolean') {
            return callback(`Eingabetype von < isAdministrator > ist falsch`, null);
        } else {
            // check if user is already exists
            findUserByID(newUser.userID, function (err, user) {
                if (user) {
                    console.log("User already exists: " + user);
                    return callback("User already exists", null)
                } else {
                    var createdUser = new User(newUser);
                    bcrypt.genSalt(10)
                        .then(salt => {
                            console.log(`Salt: ${salt}`);
                            return bcrypt.hash(createUser.password, salt);
                        })
                        .then(hash => {
                            console.log(`Hash: ${hash}`);
                        })
                        .catch(err => console.error(err.message));
                    createdUser.save(function (err) {
                        if (err) {
                            console.error("Could not create new account: " + err);
                            callback("Could not login to new account", null);
                        } else {
                            callback(null, createdUser);
                        }
                    });
                }
            });
        }
    }
}

function updateUserByID(changeUserID, changes, callback) {
    if (!changeUserID) {
        console.log("User ID is not specified");
        return callback("User ID is not specified", null);
    } else {
        // check changes for validity and presence 
        if ((Object.keys(changes).length !== 0)) {
            for (var change in changes) {
                var valiId = change === 'userID' && typeof changes[change] === 'string';
                var validName = change === 'userName' && typeof changes[change] === 'string' && changes[change].match(/^[a-zA-ZäöüÄÖÜß ]{2,30}$/);
                var validPassword = change === 'password' && typeof changes[change] === 'string';
                var validIsAdministrator = change === 'isAdministrator' && typeof changes[change] === 'boolean';
                console.log("start key checking");

                if (!valiId && !validName && !validIsAdministrator && !validPassword) {
                    console.log(`Entity for changes is not found: { ${change}: ${changes[change]} }`);
                    return callback(`Entity for changes is not found: { ${change}: ${changes[change]} }`, null);
                } else {
                    console.log("Entities are specified correctly.")
                }
            }
        } else {
            console.log("No changes to execute oder entity for changing is incorrect.");
            return callback("No changes to execute oder entity for changing is incorrect.", null);
        }
        // seach for user by ID
        findUserByID(changeUserID, function (err, user) {
            if (err) {
                console.log("User is not found..");
                return callback(err, null);
            } else {
                // assignment new values for available entities
                Object.keys(changes).forEach(change => {
                    change === 'userID' ? user.userID = changes[change] : console.log("Not changed: userID")
                    change === 'userName' ? user.userName = changes[change] : console.log("Not changed: userName")
                    change === 'password' ? user.password = changes[change] : console.log("Not changed: password")
                    change === 'isAdministrator' ? user.isAdministrator = changes[change] : console.log("Not changed: isAdministrator");
                });
                // save all changes
                user.save(function (err, user) {
                    if (err) {
                        console.log("Error by saving!");
                        callback(err, null);
                    } else {
                        console.log("Everything is saved! User: " + user);
                        callback(null, user);
                    }
                });
            }
        });
    }
}

function removeUserByID(delUserID, callback) {
    if (!delUserID) {
        console.log("User-ID has not been specified.");
        callback("User-ID has not been specified.", null);
        return;
    } else {
        const query = User.findOneAndDelete({ userID: delUserID });
        query.exec(function (err, user) {
            if (user) {
                console.log("User has been deleted.");
                callback(null, user);
            } else {
                console.error("Error: " + err);
                callback("User with specified ID has been not found.", null);
            }
        })
    }
}

function authorize(props, callback) {
    const query = User.findOne({ userID: props.userID });
    query.exec(function (err, user) {
        if (user) {
            user.comparePassword(props.password, function (err, isMatch) {
                if(err) {
                    logger.error("Password or user ID are invalid");
                    callback(err, null);
                } else {
                    if(isMatch){
                        console.log("Password is correct!");
                        callback(null, user);
                    } else {
                        console.error("Password is invalid");
                        callback("Autentication is failed: Password is invalid", null);
                    }
                }
            });
        } else {
            console.log("Did not find user for userID: " + props.userID);
            callback("Did not find user for userID: " + props.userID, null);
        }
    });
}

module.exports = {
    getUsers,
    findUserByID,
    createUser,
    updateUserByID,
    removeUserByID,
    authorize
}