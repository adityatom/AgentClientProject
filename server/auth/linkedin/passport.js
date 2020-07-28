var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin').Strategy;

exports.setup = function (User, config) {
  passport.use(new LinkedInStrategy({
    consumerKey: config.linkedin.clientID,
    consumerSecret:  config.linkedin.clientSecret,
    callbackURL: config.linkedin.callbackURL,
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({
      'linkedinId': profile.id 
    }, function(err, user) {
      if (!user) {
        user = new User({
          name: profile.first-name,
          email: profile.email-address,
          role: 'user',
          username: profile.first-name+profile.last-name,
          provider: 'linkedin',
          linkedin: profile
        });
        user.save(function(err) {
          if (err) return done(err);
          done(err, user);
        });
      } else {
        return done(err, user);
      }
    });
  }
));
};