var express  = require('express');
var passport = require('passport');
var Album    = require('../models/album.js'); // Album Model
var jwt      = require('jsonwebtoken');
var utils    = require('../utils/config.js');

var router = express.Router();

/**
 * Route('/album/new')
 * Description: Add a new Album
 */
router.post('/new', utils.ensureAuthorized, function(request, response) {
    var currentUser = jwt.verify(request.token, utils.secret)._doc;
    if (!currentUser) return response.json({success : false, message : 'Failed to Verify token'});
    if (!request.body.title) return response.json({success : false, message : 'Give me an album title please'});
    var album = new Album({
        title  : request.body.title,
        user   : currentUser._id,
        photos : []
    });
    album.save(function(err) {
        if (err) return response.json({success : false, message : 'Mongo Error + ' + err});
        return response.json({success : false, message : 'Success!'});
    });
});

module.exports = router;
