
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const Users = require('./models/users');



module.exports = {
  passportInitiate: function() {
    passport.use(new BasicStrategy(
       function(username, password, done) {
        Users.findOne({username: username, password: password}).then(function(user) {
          if (!user) {
             return done(null, false);
           } else {
             return done(null, username);
           }
         });
       }
     ));
  },
  validateUser: function() {
      return passport.authenticate('basic', {session: false});
  }
};
