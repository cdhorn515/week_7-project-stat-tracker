var mongoose = require('mongoose');

var activitiesSchema = new mongoose.Schema({
  activity: {
    type: String,
    unique: true
  },
  trackedStats: [{
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

const Activities = mongoose.model('Activities', activitiesSchema);

module.exports = Activities;
