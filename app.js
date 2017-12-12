const mongoose = require('mongoose');
const Activities = require('./models/activities');
const Users = require('./models/users');
const bodyParser = require('body-parser');
const parseurl = require('parseurl');
const express = require('express');
const middleware = require('./middleware');
const path = require('path')

const app = express();

const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/cdcStatTracker');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/static', express.static(path.join(__dirname, 'public')));

middleware.passportInitiate();
// passport.use(new BasicStrategy(
//    function(username, password, done) {
//     Users.findOne({username: username, password: password}).then(function(user) {
//       if (!user) {
//          return done(null, false);
//        } else {
//          return done(null, username);
//        }
//      });
//    }
//  ));


 // passport middleware
app.use(middleware.validateUser);

//api routes:

//show list of all activities being tracked, link to individ pages
app.get('/api/activities', passport.authenticate('basic', {session: false}), function (req, res) {
  Activities.find({}).then(function(results){
    res.json(results);
  });
});

//create a new activity to track
app.post('/api/activities', passport.authenticate('basic', {session: false}), function(req, res) {
  var newActivity = new Activities({activity: req.body.activity}).save().then(function(result){
    var addedTrackedStats = {amount: req.body.trackedStats[0].amount, date: req.body.trackedStats[0].date};
    result.trackedStats.push(addedTrackedStats);
    result.save().then(function(){
      res.json(newActivity);
  });
  });
});

//show information about one activity that is being tracked--get title from id and show all for that title
app.get('/api/activities/:id', passport.authenticate('basic', {session: false}), function(req, res) {
  var id = req.params.id;
   Activities.findOne({_id: id}).then(function(result) {
       res.json(result);
});
});

//update attribute of tracked activity, not trackedStat--should be patch not put?
app.put('/api/activities/:id', passport.authenticate('basic', {session: false}), function(req, res) {
  Activities.updateOne({_id: req.params.id},
  {activity: req.body.activity}).then(function(newActivity){
    res.json(newActivity);
  });
});

//delete one activity being tracked--find id, get title, delete all with that title
app.delete('/api/activities/:id', passport.authenticate('basic', {session: false}), function (req, res){
    Activities.deleteOne({_id: req.params.id}).then(function(){
      res.json({});
    });
  });


//add tracked data for a day--can override data for a day already tracked-
app.post('/api/activities/:id/trackedStats', passport.authenticate('basic', {session: false}), function(req, res) {
  Activities.findOne(
  {_id: req.params.id}).then(function(result){
    result.trackedStats.push({
      amount: req.body.amount,
      date: req.body.date
    });
      result.save();
      res.json(result);
    });
  });


//delete one day of activity--find one and delete
app.delete('/api/stats/:id', function(req, res) {
  var statsId = req.body._id;
  console.log(statsId);
  Activities.update({_id: req.params.id}, {$pull: {trackedStats: {_id: statsId}}}).then(function(result) {
    console.log('deleted');
    res.json(result);
  });
});

// var activities = new Activities({
//   activity: "push ups",
//   trackedStats: [{ amount: 12}]
// });
//
// activities.save();

// var users = new Users({
//   username: "Sera",
//   password: "treats"
// });
//
// users.save();

app.listen(3000, function(req, res) {
  console.log("I'm listening");
});
