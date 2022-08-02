const mongoose = require('mongoose');

const TournamentSchema = mongoose.Schema({
  admin_name: { type: String, required: true },
  name: { type: String, required: true },
  tournament_id: { type: String, unique: true, required: true },
  date: { type: Date },
});

module.exports = mongoose.model('Tournament', TournamentSchema);
