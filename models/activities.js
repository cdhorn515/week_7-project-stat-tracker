var mongoose = require('mongoose');

var activitesSchema = new mongoose.Schema({
  title: String,
  date: {
    type: Date,
    default: Date.now
  },
  trackedStat: Number
});

const Activities = mongoose.model('Activities', activitiesSchema);

module.exports = Activies;
