const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  const admins = await Admin.find({});

  res.json(admins);
});

router.post('/signup', async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const admin = new Admin({
    name: req.body.name,
    password: password,
  });

  const savedAdmin = await admin.save();
  res.json(savedAdmin);
});

router.post('/login', async (req, res) => {
  try {
    const admin = await Admin.findOne({ name: req.body.name });

    if (!admin) {
      throw new Error('not find admin');
    }
    const compared = await bcrypt.compare(req.body.password, admin.password);
    if (!compared) {
      throw new Error('パスワードが違います');
    }
    const payload = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    };

    const token = jwt.sign(payload, 'secret');
    return res.json({ token });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
