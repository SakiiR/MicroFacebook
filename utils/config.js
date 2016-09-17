var sha512 = require('sha512');

var SECRET = 'MySecretString';

// Generates hash using bCrypt
var createHash = function(password){
  return sha512(password).toString('hex');
};

// Bearer parser
var ensureAuthorized = function(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(' ');
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
};

module.exports = {
  secret           : SECRET,
  createHash       : createHash,
  ensureAuthorized : ensureAuthorized
};
