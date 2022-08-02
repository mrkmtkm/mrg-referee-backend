const mongoose = require('mongoose');

const ResultSchema = mongoose.Schema({
  tournament_id: { type: String, required: true },
  player_name: { type: String, required: true },
  item: { type: String },
  execution: { type: Number },
  difficulty: { type: Number },
  deduction: { type: Number },
});

module.exports = mongoose.model('Result', ResultSchema);
