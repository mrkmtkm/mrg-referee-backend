const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('./authenticate');

router.get('/', async (req, res) => {
  const admins = await Admin.find({});

  res.json(admins);
});

router.post('/signup', async (req, res) => {
  try {
    const admins = await Admin.find({ name: req.body.name });
    if (admins.length > 0) {
      return res.status(400).send('nameがuniqueではない');
    }
    const password = await bcrypt.hash(req.body.password, 10);
    const admin = new Admin({
      name: req.body.name,
      password: password,
    });

    const savedAdmin = await admin.save();
    res.json(savedAdmin);
  } catch (err) {
    return res.status(400).send('nameがuniqueではない');
  }
});

router.post('/login', async (req, res) => {
  try {
    const admin = await Admin.findOne({ name: req.body.name });

    if (!admin) {
      res.status(400).send('not find admin');
    }
    const compared = await bcrypt.compare(req.body.password, admin.password);
    if (!compared) {
      res.status(400).send('パスワードが違います');
    }

    const payload = {
      id: admin.id,
      name: admin.name,
    };

    const token = jwt.sign(payload, 'secret');
    return res.json({ admin_access_token: token });
  } catch (err) {
    res.status(400).send('エラーが発生しました');
  }
});

router.get('/me', (req, res) => {
  const bearToken = req.headers['authorization'];
  const bearer = bearToken.split(' ');
  const token = bearer[1];

  jwt.verify(token, 'secret', (err, currentAdmin) => {
    if (err) {
      return res.sendStatus(401);
    } else {
      return res.json(currentAdmin);
    }
  });
});

module.exports = router;
