const express = require('express')
const router = express.Router();

router.get('/', function (request, response) {
    response.send('Hello World!')
})

router.get('/json', function (request, response) {
    response.json( {name: 'JSON Hallo'} )
})

module.exports = router;
