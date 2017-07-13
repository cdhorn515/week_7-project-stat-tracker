const mongoose = require('mongoose');
const Activites = require('./models/activites');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');

const app = require('express');

const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/cdcStatTracker');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

passport.use(new BasicStrategy(
   function(username, password, done) {
    User.findOne({username: username, password: password}).then(function(user) {
      if (!user) {
         return done(null, false);
       } else {
         return done(null, username);
       }
     });
   }
 ));

 // middleware
app.use(passport.authenticate('basic', {session: false}));

//api routes:

//show list of all activities being tracked, link to individ pages
app.get('/api/activities', function (req, res) {
  Activities.find({}).then(function(results){
    res.json(results);
  });
});

//create a new activity to track
api.post('/api/activities', function(req, res) {
  activity = new Activities(req.body).save().then(function(newActivity){
    res.json({});
 });
});

//show information about one activity that is being tracked--get title from id and show all for that title
app.get('/api/activities/:id', function(req, res) {
  var id = req.params.id;
   Activites.findOne({_id: id}).then(function(tempActivity) {
     console.log(tempActivity);
    res.json(tempActivity);
  });
});

//update attribute of tracked activity, not trackedStat
app.put('/api/activities/:id', function(req, res) {

});

//delete one activity being tracked--find id, get title, delete all with that title
app.delete('/api.activities/:id', function (req, res){

});

//add tracked data for a day--can override data for a day already tracked
app.post('/api/activities/:id/stats', function(req, res) {

});

//delete one day of activity--find one and delete
app.delete('/api/stats/:id', function(req, res) {

});
