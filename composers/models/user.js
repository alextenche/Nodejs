'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// check email and password with the ones in database
UserSchema.statics.authenticate = function(email, password, callback){
  User.findOne({ email: email})
    .exec(function(error, user){
      if(error){
        return callback(error);
      } else if (!user) {
        var err = new Error('user not found');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(error, result){
        if(result === true){
          return callback(null, user);
        } else {
          return callback();
        }
      });
    });
}

// hash password before saving in db
UserSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      return next(err);
    } else {
      user.password = hash;
      next();
    }
  });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
