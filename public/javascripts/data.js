
// Logging
let loggingCookies=false;
let loggingPersistence=false;



// Default Functions
function saveTableData(table){
  saveTableDataToCookies(table);
}
function loadTableData(id){
  return loadTableDataFromCookies(id);
}

function persistenceWriter(id, type, data){
  //id - tables persistence id
  //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
  //data - array or object of data
  if(loggingPersistence)
    console.log('writer used with id '+id);
  savePersistenceLocal(id, type, data);
}
function savePersistenceLocal(id, type, data){
  localStorage.setItem(id + "-" + type, JSON.stringify(data));
}



// Local persistence
function persistenceReader(id, type){
  //id - tables persistence id
  //type - type of data being persisted ("sort", "filter", "group", "page" or "columns")
  if(loggingPersistence)
    console.log('reader used with id '+id);
  loadPersistenceLocal(id, type);
}
function loadPersistenceLocal(id, type){
  var data = localStorage.getItem(id + "-" + type);
  return data ? JSON.parse(data) : false;
}



// Cookie Handling
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));  // Set expiry time
  const expiresStr = "expires=" + expires.toUTCString();
  
  // Set cookie with SameSite=None and Secure attributes
  document.cookie = `${name}=${value};${expiresStr};path=/;SameSite=None;Secure`;
}
function getCookie(name) {
  const nameEq = name + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim();
      if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
  }
  return null;
}



// Table data cookies
function saveTableDataToCookies(table) {
  const tableData = table.getData();
  filename=table.options.persistenceID;

  const jsonData = JSON.stringify(tableData);  // Convert to JSON string
  setCookie(filename, jsonData, 7000000);  // Save cookie for 7 days
  if(loggingCookies) console.log("Table data saved to cookies! Name is "+filename);
}

function loadTableDataFromCookies(id) {
  filename=id;
  if(loggingCookies) console.log("Try loading cookie named "+filename)
  const savedData = getCookie(id);  // Get saved table data cookie
  if (savedData) {
      const tableData = JSON.parse(savedData);  // Parse the JSON string back into an object
      // Recreate the Tabulator table with the saved data
      if(loggingCookies) console.log("Table data loaded from cookies! Name is "+filename);
      return tableData;
  } else {
    if(loggingCookies) console.log("No table data found in cookies.");
  }
}



//sync json via http patch
function patchToServer(url, data) {
  fetch(url, {
    method: 'PATCH', // HTTP method
    headers: {
      'Content-Type': 'application/json', // Ensure the server understands JSON
    },
    body: JSON.stringify(data), // Convert JavaScript object to JSON
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the response JSON
    })
    .then(data => {
      console.log('Success:', data); // Handle the response
    })
    .catch(error => {
      console.error('Error:', error); // Handle errors
    });
  }

  //sync json via http patch
function putToServer(url, data) {
  fetch(url, {
    method: 'PUT', // HTTP method
    headers: {
      'Content-Type': 'application/json', // Ensure the server understands JSON
    },
    body: JSON.stringify(data), // Convert JavaScript object to JSON
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Parse the response JSON
    })
    .then(data => {
      console.log('Success:', data); // Handle the response
    })
    .catch(error => {
      console.error('Error:', error); // Handle errors
    });
  }
