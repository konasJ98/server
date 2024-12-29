var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug')('server:standardTable');

/* GET home page. */
router.get('/:tableID', function(req, res, next) {
  const data = {
    staticserve: 'http://localhost:3000',
    apiurl: 'http://localhost:3000',
    serverurl: 'http://localhost:3000/'+req.params.tableID,
    tableID: req.params.tableID
  };
  res.render('standardTable', data);
  //debug('fallback')
  //res.sendFile(path.join(__dirname, 'standardTable.html'));
});

router.patch('/:tableID', function(req, res, next) {
  
});

router.put('/:tableID', function(req, res, next) {
  debug('received a put:');
  debug(req.body);
  res.json({ message: 'Data received' });
});

module.exports = router;
