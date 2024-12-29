
const jsonpatch = require('fast-json-patch');

const test = require('../public/test.json');

//observer
observer = jsonpatch.observe(test);

//deepcopy
let data= JSON.parse(JSON.stringify(test));;
let data_= JSON.parse(JSON.stringify(test));;

//change data
data.string='adsfdd';

//create patch
var patch = jsonpatch.compare(test, data);

//patch data_
jsonpatch.applyPatch(data_, patch);

