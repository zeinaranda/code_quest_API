var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');

const {Boss} = require('../models');

const v = new Validator();

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM questions';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching questions:', err);
        res.status(500).send('Error fetching questions');
        return;
      }
      res.json(results);
    });
  });
  