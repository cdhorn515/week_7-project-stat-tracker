const mongoose = require('mongoose');
const Activities = require('./models/activities');
const Users = require('./models/users');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const express = require('express');

const app = express();

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
    Users.findOne({username: username, password: password}).then(function(user) {
      if (!user) {
         return done(null, false);
       } else {
         return done(null, username);
       }
     });
   }
 ));


 //passport middleware
app.use(function (req, res, next) {
  passport.authenticate('basic', {session: false});
  next();
});

//api routes:

//show list of all activities being tracked, link to individ pages
app.get('/api/activities', function (req, res) {
  Activities.find({}).then(function(results){
    res.json(results);
  });
});

//create a new activity to track
app.post('/api/activities', function(req, res) {
  Activities.create({name: req.body.activity});
    trackedStats.amount.push(req.body.trackedStats).then(function(newActivity){
      console.log(newActivity);
    }).catch(function(error){
      console.log('oops something went wrong');
    });
    res.json({});
});

//show information about one activity that is being tracked--get title from id and show all for that title
app.get('/api/activities/:id', function(req, res) {
  var id = req.params.id;
   Activites.findOne({_id: id}).then(function(result) {
     var activity = result.activity;
     Activities.find({activity: activity}).then(function(activities){
       console.log('all activities named ' + activity);
     }).catch(function(error){
       console.log('error on getting activity info');
     });
     res.json({activites});
   });
});

//update attribute of tracked activity, not trackedStat--should be patch not put?
app.put('/api/activities/:id', function(req, res) {
  Activities.updateOne({_id: req.params.id},
  {activity: req.body.activity}).then(function(newActivity){
    res.json(newActivity);
  });
});

//delete one activity being tracked--find id, get title, delete all with that title
app.delete('/api.activities/:id', function (req, res){
  

});

//add tracked data for a day--can override data for a day already tracked--should be put not post?
app.put('/api/activities/:id/stats', function(req, res) {

});

//delete one day of activity--find one and delete
app.delete('/api/stats/:id', function(req, res) {

});

// var activities = new Activities({
//   activity: "push ups",
//   trackedStats: [{ amount: 12}]
// });
//
// activities.save();
//
// var users = new Users({
//   username: "Sera",
//   password: "treats"
// });
//
// users.save();

app.listen(3000, function(req, res) {
  console.log("I'm listening");
});