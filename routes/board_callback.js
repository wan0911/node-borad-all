// @ts-check
const express = require('express');

const router = express.Router();

const mongoClient = require('./mongo');

router.get('/', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('kdt1').collection('board');
  const ARTICLE = await cursor.find({}).toArray();
  const articleLen = ARTICLE.length;
  res.render('board', { ARTICLE, articleCounts: articleLen });

  MongoClient.connect(uri, (err, db) => {
    const data = db.db('kdt1').collection('board');

    data.find({}).toArray((err, result) => {
      const ARTICLE = result;
      const articleLen = ARTICLE.length;
      res.render('board', { ARTICLE, articleCounts: articleLen });
    });
  });
});

router.get('/write', (req, res) => {
  res.render('board_write');
});

router.post('/write', (req, res) => {
  if (req.body.title && req.body.content) {
    const newArticle = {
      title: req.body.title,
      content: req.body.content,
    };

    MongoClient.connect(uri, (err, db) => {
      const data = db.db('kdt1').collection('board');

      data.insertOne(newArticle, (err, result) => {
        res.redirect('/board');
      });
    });
  } else {
    const err = new Error('데이터가 없습니다');
    err.statusCode = 404;
    throw err;
  }
});

router.get('/modify/title/:title', (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    const data = db.db('kdt1').collection('board');

    data.findOne({ title: req.params.title }, (err, result) => {
      if (err) {
        throw err;
      } else {
        const selectedArticle = result;
        res.render('board_modify', { selectedArticle });
      }
    });
  });
});

router.post('/modify/title/:title', (req, res) => {
  if (req.body.title && req.body.content) {
    MongoClient.connect(uri, (err, db) => {
      const data = db.db('kdt1').collection('board');

      data.updateOne(
        { title: req.params.title },
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
          },
        },
        (err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect('/board');
          }
        }
      );
    });
  } else {
    const err = new Error('요청 값이 없습니다.');
    err.statusCode = 404;
    throw err;
  }
});

router.delete('/delete/title/:title', (req, res) => {
  MongoClient.connect(uri, (err, db) => {
    const data = db.db('kdt1').collection('board');

    data.deleteOne({ title: req.params.title }, (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send('삭제 완료');
      }
    });
  });
});

module.exports = router;
