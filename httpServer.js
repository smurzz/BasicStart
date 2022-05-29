const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const database = require('./database/db')

const testRoutes = require('./endpoints/test/TestRoutes')
const userRoutes = require('./endpoints/user/UserRoute')
const authenticationRoutes = require('./endpoints/authentication/AuthenticationRoute') 
const forumThreadRoutes = require('./endpoints/ForumThread/ForumThreadRoute')
const fileUploadRoute = require('./endpoints/fileUpload/FileUploadRoute')
const forumMessageRoutes = require('./endpoints/ForumMessage/ForumMessageRoute')

const app = express()
app.use(bodyParser.json())

app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/Temp/'
}));

/* Adding the routes */

app.use('/', testRoutes);
app.use('/user', userRoutes);
app.use('/authenticate', authenticationRoutes);
app.use('/forumThreads', forumThreadRoutes);
app.use('/fileUpload', fileUploadRoute);
app.use('/forumMessages', forumMessageRoutes);

database.initDB(function(err, db){
    if(db){
        console.log("Anbindung von Datenbank erfolgreich.");
    } else {
        console.log("Anbindung von Datenbank gescheitert.");
    }
})

/* Error Handler */
app.use(function(req, res, next){
    res.status(500).send('Something broken!');
});

app.use(function(req, res, next){
    res.status(404).send('Sorry can not find that! This url is not suppored.');
});

const port = 8080
const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

module.exports = server