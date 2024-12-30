const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');
const jsonpatch = require('fast-json-patch');

var express = require('express');

class Json5Database {
  constructor(name) {
    this.name = name;
    this.path = './data/'+name;

    //Get songpool
    this.Pool = Json5Handler.read(this.path+'/songpool.json5');

    //Get lists
    this.Lists = this.loadListsByFiles();

    //Get meta
    this.meta = Json5Handler.read(this.path+'/meta.json5');
  }

  CreateList(name) {
    //First check if this operation is valied, i.e. doesn't exist already, name is ok, ...
    // TODO
    
    //create list file
    let data = { listID: this.meta.nextID, entries: [ ], patches: [ ] };
    Json5Handler.write(this.path+'/lists/'+this.meta.nextID+'.json5', data);

    //update meta
    this.meta.nextID=this.meta.nextID+1;
    let newListMeta = {name: name, listID: data.listID};
    this.meta.lists.push(newListMeta);
    this.SaveMeta();
    
    //update lists
    this.Lists = this.loadListsByFiles();

    return newListMeta
  }

  SaveMeta() {
    Json5Handler.write(this.path+'/meta.json5', this.meta);
  }

  GetMeta() {
    return structuredClone(this.meta); //deepcopy?
  }

  GetPoolTableData() {
    return structuredClone(this.Pool.entries); //deepcopy?
  }

  GetListTableData(listID) {
    if(listID==0)
      return this.GetPoolTableData();
    
    // Find the element with the matching filename
    const List = structuredClone(this.Lists.find(item => item.filename === listID+'.json5').content);
    
    let pool=this.GetPoolTableData();
    //...get songs in the correct order
    let index = List.entries;
    //with shallow copy
    let sheet = List.entries.map(index => ({ ...pool[index] }));
    
    //apply local patches
    List.patches.forEach(patch => {jsonpatch.applyPatch(sheet, [patch]);}); //damn... the [ ] outside of patch are important
    
    return sheet; //deepcopy?
  }

  patchListAndSave(listID, patches) {
    if(listID==0)
      return this.patchPoolAndSave();

    // TODO: probably check if the patch is acutally valid, and allowed

    //Get filename
    let filename = this.path+'/lists/'+listID+'.json5';

    try {
      let List = this.Lists.find(item => item.content.listID === listID).content;

      // TODO: patches

      List.patches.push(...patches);
      Json5Handler.write(filename, List);
    } catch (error) {
      throw new Error('patchListAndSave has error: '+filename+' '+patches);
    }
  }

  patchPoolAndSave(patches) {
    // TODO: probably check if the patch is acutally valid, and allowed
    try {
      console.log(patches)
      patches.forEach(patch => {console.log(patch); jsonpatch.applyPatch(this.Pool.entries, [patch]);}); //damn... the [ ] outside of patch are important
      Json5Handler.write(this.path+'/songpool.json5', this.Pool);
    } catch (error) {
        console.log(error);
        throw new Error('patchPoolAndSave has error: '+patches);
    }
  }

  // Get all files in the directory
  getLists() {
    try {
        let dir=this.path+'/lists';
        // Read all file names from the directory
        const files = fs.readdirSync(dir);

        // Filter out non-file items (directories, etc.)
        return files.filter(file => fs.statSync(path.join(dir, file)).isFile());
    } catch (error) {
      console.error(`Error reading directory: ${this.directory}`, error);
      return [];
    }
  }

  // Load all files and process them (e.g., parse JSON)
  loadListsByFiles() {
    const files = this.getLists();
    const fileContents = [];
    
    files.forEach(file => {
      try {
        const filePath = path.join(this.path+'/lists', file);
        const fileData = fs.readFileSync(filePath, 'utf-8');

        let parsedObject = null;
        // Parse the content using JSON5
        try {
            parsedObject = JSON5.parse(fileData);
        } catch (error) {
            console.error("Error parsing JSON5 content:", error);
            console.log(fileData);
        }

        // You can parse or process the file as needed (e.g., JSON)
        fileContents.push({
          filename: file,
          content: parsedObject
        });
      } catch (error) {
        console.error(`Error reading file: ${file}`, error);
      }
    });

    return fileContents;
  }
}

class Json5Handler {
  // Read data from the JSON5 file and parse it
  static read(path) {
    try {
      const rawData = fs.readFileSync(path, 'utf-8');
      const data = JSON5.parse(rawData);
      return data;
    } catch (error) {
      console.error(`Error reading file: ${path}`, error);
      return null;
    }
  }

  // Write data to the JSON5 file
  static write(path, data) {
    try {
      const json5Data = JSON5.stringify(data, null, 2); // Format with indentation
      fs.writeFileSync(path, json5Data, 'utf-8');
      //console.log(`Successfully written to ${path}: `+json5Data);
    } catch (error) {
      console.error(`Error writing to file: ${path}`, error);
    }
  }}

module.exports = Json5Database;
