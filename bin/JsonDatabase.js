const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');
const jsonpatch = require('fast-json-patch');

class Json5Database {
  constructor(name) {
    this.name = name;
    this.path = './data/'+name;

    //Get songpool
    this.Pool = this.read(this.path+'/songpool.json5');

    //Get lists
    this.Lists = this.loadLists();
  }

  GetPoolTableData() {
    return structuredClone(this.Pool.entries); //deepcopy
  }

  GetListTableData(name) {
    // Find the element with the matching filename
    const List = structuredClone(this.Lists.find(item => item.filename === name+'.json5').content); // TODO: deepcopy below now unnecessary?
    
    let pool=this.GetPoolTableData();
    //...get songs in the correct order
    let index = List.entries;
    //with shallow copy
    let sheet = List.entries.map(index => ({ ...pool[index] }));
    
    //apply local patches
    List.patches.forEach(patch => {jsonpatch.applyPatch(sheet, [patch]);}); //damn... the [ ] outside of patch are important
    
    return structuredClone(sheet); //deepcopy
  }

  patchListAndSave(name, patches) {
    // TODO: probably check if the patch is acutally valid, and allowed
    try {
        let List = this.Lists.find(item => item.filename === name+'.json5').content;

        // TODO: patches

        List.patches.push(...patches);
        this.write(this.path+'/lists/'+name+'.json5', List);
    } catch (error) {
        throw new Error('patchListAndSave has error: '+name+' '+patch);
    }
  }

  patchPoolAndSave(patches) {
    // TODO: probably check if the patch is acutally valid, and allowed
    try {
        patches.forEach(patch => {console.log(patch); jsonpatch.applyPatch(this.Pool.entries, [patch]);}); //damn... the [ ] outside of patch are important
        this.write(this.path+'/songpool.json5', this.Pool);
    } catch (error) {
        console.log(error);
        throw new Error('patchPoolAndSave has error: '+patch);
    }
  }

  // Read data from the JSON5 file and parse it
  read(path) {
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
  write(path, data) {
    try {
      const json5Data = JSON5.stringify(data, null, 2); // Format with indentation
      fs.writeFileSync(path, json5Data, 'utf-8');
      console.log(`Successfully written to ${path}`);
    } catch (error) {
      console.error(`Error writing to file: ${path}`, error);
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
  loadLists() {
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

  // Append data to the JSON5 file
  /*append(data) {
    try {
      const currentData = this.read() || {};
      // Merge the existing data with the new data
      const updatedData = { ...currentData, ...data };
      this.write(updatedData);
    } catch (error) {
      console.error(`Error appending to file: ${this.filename}`, error);
    }
  }*/
}

module.exports = Json5Database;
