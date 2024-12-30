var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug')('server:standardTable');
const Json5Database = require('../bin/JsonDatabase.js');


//get json files for table data
router.get('/:tableID.json', function(req, res, next) {
  tableID = req.params.tableID;
  p = new Json5Database(tableID);
  data=p.GetPoolTableData();
  try {
    res.json(data);
  } catch (err) {
    console.error("Error sending data:", err);
    res.status(500).send("Internal Server Error");
  }
});
router.get('/:tableID/:listID.json', function(req, res, next) {
  tableID=req.params.tableID;
  listID=req.params.listID;
  p = new Json5Database(tableID);
  data=p.GetListTableData(listID);
  try {
    res.json(data);
  } catch (err) {
    console.error("Error sending data:", err);
    res.status(500).send("Internal Server Error");
  }
});


/* GET home page. */
router.get('/:tableID([^.]+)', function(req, res, next) {
  console.log(req.params.tableID);
  const data = {
    staticserve: 'http://localhost:3000',
    host: 'http://localhost:3000',
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
  tableID=req.params.tableID;
  patches=req.body;

  try {
    p = new Json5Database(tableID);
    p.GetListTableData('sheet1');
    p.patchPoolAndSave(patches);
  } catch (error) {
    debug('error while patching pool');
  }

  res.json({ message: 'Data received' });
});
//handle patch list
router.patch('/:tableID/:listID', function(req, res, next) {
  tableID=req.params.tableID;
  listID=req.params.listID;
  patches=req.body;
  debug('received a patch to list '+tableID+'/'+listID+':');
  debug(req.body);

  debug('try patching and saving');
  try {
    
  } catch (error) {
    
  }

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
