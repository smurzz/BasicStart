var express = require('express');
var router = express.Router();
var path = require('path');

/* This form allow to create a rest call with multipart/form-data */
router.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/upload.html'));
})

router.post('/upload', function(req, res){
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname + '/../../uploadedFiles/' + sampleFile.name, function(err){
        if(err){
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });
});

module.exports = router;