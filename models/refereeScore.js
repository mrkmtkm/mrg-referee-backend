const mongoose = require('mongoose');

const RefereeScoreSchema = mongoose.Schema({
  result_id: { type: String, required: true },
  referee_name: { type: String, required: true },
  execution: { type: Number },
  difficulty: { type: Number },
});

module.exports = mongoose.model('RefereeScore', RefereeScoreSchema);
