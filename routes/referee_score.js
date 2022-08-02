const express = require('express');
const router = express.Router();
const RefereeScore = require('../models/RefereeScore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('./authenticate');

router.get('/index', authenticate, async (req, res) => {
  try {
    const id = req.query.id;

    const scores = await RefereeScore.find({ result_id: id });

    res.json(scores);
  } catch (err) {
    console.log(err);
    res.status(400).send('一覧の取得に失敗しました');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const score = await RefereeScore.findByIdAndRemove(id);

    res.status(200).send('成功');
  } catch (err) {
    console.log(err);
    res.status(400).send('取得に失敗しました');
  }
});

module.exports = router;
