var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug')('server:standardTable');

/* GET home page. */
router.get('/:tableID', function(req, res, next) {
  const data = {
    staticserve: 'http://localhost:3000',
    tableID: req.params.tableID
  };
  res.render('standardTable', data);
  //debug('fallback')
  //res.sendFile(path.join(__dirname, 'standardTable.html'));
});

module.exports = router;
