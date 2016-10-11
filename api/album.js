var express  = require('express');
var passport = require('passport');
var Album    = require('../models/album.js'); // Album Model
var User     = require('../models/user.js'); // User Model
var jwt      = require('jsonwebtoken');
var utils    = require('../utils/config.js');

var router = express.Router();

/**
 * @Route('/album/new')
 * Description: Add a new Album
 */
router.post('/new', utils.ensureAuthorized, function(request, response) {
    var currentUser = jwt.verify(request.token, utils.secret)._doc;
    if (!currentUser) return response.json({success : false, message : 'Failed to Verify token'});
    if (!request.body.name) return response.json({success : false, message : 'Give me an album name please'});
    var album = new Album({
        name  : request.body.name,
        user   : currentUser._id,
        photos : []
    });
    album.save(function(err) {
        if (err) return response.json({success : false, message : 'Mongo Error + ' + err});
        User.findOne({_id : currentUser._id}, function(err, user) {
            if (err) return response.json({success : false, message : 'Mongo Error + ' + err});
            if (!user) return response.json({success : false, message : 'Failed to find user ' + currentUser._id});
            user.albums.push(album._id);
            user.save(function(err) {
                if (err) return response.json({success : false, message : 'Mongo Error + ' + err});
                return response.json({success : true, message : 'Success!'});
            });
        });
    });
});

module.exports = router;
