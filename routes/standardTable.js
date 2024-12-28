var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug')('server:standardTable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('standardTable', { title: 'Express' });
  //debug('fallback')
  //res.sendFile(path.join(__dirname, 'standardTable.html'));
});

module.exports = router;
