

class Session {
    constructor() {
        this.sheets=[]
        this.runningIndex=0
    }
  
    addSheet(sheet) {
        sheets.push(sheet);
        this.runningIndex++;
    }
  }
  

  class Sheet {
    constructor(name, tableID) {
      this.name = name;
      this.tableID = tableID;
    }
  }