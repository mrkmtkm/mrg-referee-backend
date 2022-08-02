const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('./authenticate');

router.get('/index', authenticate, async (req, res) => {
  try {
    const id = req.query.id;

    const results = await Result.find({ tournament_id: id });

    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(400).send('一覧の取得に失敗しました');
  }
});

router.post('/store', authenticate, async (req, res) => {
  try {
    const result = new Result({
      tournament_id: req.body.tournament_id,
      player_name: req.body.player_name,
      item: req.body.item,
    });

    const saveResult = await result.save();

    res.json(saveResult);
  } catch (err) {
    console.log(err);
    res.status(400).send('登録に失敗しました');
  }
});

router.post('/update', authenticate, async (req, res) => {
  try {
    const result = await Result.findOneAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          execution: req.body.execution,
          difficulty: req.body.difficulty,
          deduction: req.body.deduction,
        },
      }
    );
    const saveResult = await result.save;

    res.json(saveResult);
  } catch (err) {
    console.log(err);
    res.status(400).send('登録に失敗しました');
  }
});

router.get('/detail', async (req, res) => {
  try {
    const id = req.query.id;
    const result = await Result.findOne({ _id: id });

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).send('取得に失敗しました');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await Result.findByIdAndRemove(id);

    res.status(200).send('成功');
  } catch (err) {
    console.log(err);
    res.status(400).send('取得に失敗しました');
  }
});

module.exports = router;
