var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug')('server:standardTable');
const Json5Database = require('../bin/JsonDatabase.js');

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

//handle patch songpool
router.patch('/:tableID', function(req, res, next) {
  debug('received a patch to songpool of "'+req.params.tableID+'":');
  debug(req.body);
  res.json({ message: 'Data received' });
});

//handle patch sheet
router.patch('/:tableID/:sheetID', function(req, res, next) {
  debug('received a patch to sheet '+req.params.tableID+'/'+req.params.sheetID+':');
  debug(req.body);
  res.json({ message: 'Data received' });
});

/*
//handle put songpool
router.put('/:tableID', function(req, res, next) {
  debug('received a put to songpool of "'+req.params.tableID+'":');
  debug(req.body);
  res.json({ message: 'Data received' });
});

//handle put sheet
router.put('/:tableID/:sheetID', function(req, res, next) {
  debug('received a put to sheet '+req.params.tableID+'/'+req.params.sheetID+':');
  debug(req.body);
  res.json({ message: 'Data received' });
});*/

module.exports = router;
