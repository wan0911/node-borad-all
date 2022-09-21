// @ts-check

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  console.log(req.cookies.popup);
  // 쿠키 전달
  res.render('index', { popup: req.cookies.popup });
});

router.post('/cookie', (req, res) => {
  res.cookie('popup', 'hide', {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    httpOnly: true,
  });
  res.send('쿠키 생성 성공');
});

module.exports = router;
