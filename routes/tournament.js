const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('./authenticate');

router.get('/index', authenticate, async (req, res) => {
  const bearToken = req.headers['authorization'];
  const buffer = new Buffer.from(bearToken.split('.')[1], 'base64');
  const payload = JSON.parse(buffer.toString('ascii'));

  const tournaments = await Tournament.find({ admin_name: payload.name });

  res.json(tournaments);
});

router.post('/store', authenticate, async (req, res) => {
  try {
    const tournaments = await Tournament.find({
      tournament_id: req.body.tournament_id,
    });
    if (tournaments.length > 0) {
      return res.status(400).send('同じ大会IDが存在します');
    }
    const tournament = new Tournament({
      admin_name: req.body.admin_name,
      name: req.body.name,
      tournament_id: req.body.tournament_id,
      date: new Date(req.body.date),
    });

    const saveTournament = await tournament.save();

    res.json(saveTournament);
  } catch (err) {
    console.log(err);
    res.status(400).send('登録に失敗しました');
  }
});

router.get('/detail', async (req, res) => {
  try {
    const id = req.query.id;
    const tournament = await Tournament.findOne({ tournament_id: id });

    res.json(tournament);
  } catch (err) {
    console.log(err);
    res.status(400).send('取得に失敗しました');
  }
});

router.get('/find', async (req, res) => {
  try {
    const id = req.query.tournament_id;
    const tournament = await Tournament.findOne({ tournament_id: id });

    res.json(tournament);
  } catch (err) {
    console.log(err);
    res.status(400).send('取得に失敗しました');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const tournament = await Tournament.findByIdAndRemove(id);

    res.status(200).send('成功');
  } catch (err) {
    console.log(err);
    res.status(400).send('取得に失敗しました');
  }
});

module.exports = router;
