var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug')('server:standardTable');
const Json5Database = require('../bin/JsonDatabase.js');
const JSON5 = require('json5');


//get json files for table data
//this is replaced by the static serve
router.get('/:tableID/:listID', function(req, res, next) {
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

//serve the files in the directiory statically. accept only GET, because other requests make no sense here?
//router.use('/:tableID/', express.static(path.join(__dirname, 'data'))); //doesn't work

/* GET home page. */
router.get('/:tableID([^.]+)', function(req, res, next) {
  tableID=req.params.tableID;
  console.log('table router: "'+ tableID + '"');
  p = new Json5Database(tableID);
  const data = {
    staticserve: 'http://localhost:3000',
    host: 'http://localhost:3000',
    apiurl: 'http://localhost:3000',
    serverurl: 'http://localhost:3000/'+req.params.tableID,
    tableID: req.params.tableID,
    meta: JSON5.stringify(p.GetMeta())
  };
  res.render('standardTable', data);
  //debug('fallback')
  //res.sendFile(path.join(__dirname, 'standardTable.html'));
});


//handle patch
router.patch('/:tableID', function(req, res, next) {
  tableID=req.params.tableID;
  patches=req.body.patches;
  listID=req.body.listID;
  
  try {
    p = new Json5Database(tableID);
    p.patchListAndSave(listID, patches);
  } catch (error) {
    debug('error while patching pool: ', error);
  }

  res.json({ message: 'Data received' });
});

//Put to create table
router.put('/:tableID', function(req, res){
  try {
    tableID=req.params.tableID;
    p = new Json5Database(tableID);
    newListMeta = p.CreateList(req.body);
    res.json({ message: 'Created table', meta:p.GetMeta(), newListMeta: newListMeta, body: req.body });
  } catch (error) {
    console.log('error creating table: ', error)
  }
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
