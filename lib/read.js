const fs = require('fs');
const Store = require('../lib/create');

exports = module.exports;

exports.read = function(path, callback) {
  fs.readFile(Store.path + path, function(err,data) {
    callback(err,JSON.parse(data));
  });
};

exports.retrieveByType = function(type, callback) {
  fs.exists(Store.path + type, function(exists) {
    if(!exists) return [];
    else {
      // read the list of files in that directory
      let result = [];
      let counter = 0;
      fs.readdir(Store.path + type, function(err,files) {
        files.forEach(function(file) {
          fs.readFile(Store.path + type + '/' + file, function(err,rawData) {
            result.push(JSON.parse(rawData));
            counter++;
            if(counter === files.length) callback(result);
          });
        });
      });
    };
  });
};

// Attempt at asynchronous searching.
exports.retrieveByIdArray = function(array, callback) {
  // Is there really no more efficient way of searching for files??
  fs.readdir(Store.path, function(err,folders) {
    let folderCounter = 0;
    let counterObj = {};
    folders.forEach(function(folder) {
      fs.readdir(Store.path + folder, function(err,files) {
        counterObj[folder] = 0;
        array.forEach(function(name,index) {
          const matchIndex = files.indexOf(name);
          if(matchIndex !== -1) {
            exports.read(Store.path + folder + '/' + files[matchIndex], function(err,data) {
              if(err) console.log('error');
              array[index] = data;
              counterObj[folder]++;
              if(counterObj[folder] === array.length) {
                folderCounter++;
                if(folderCounter === folders.length) callback(array);
              };
            });
          } else {
            counterObj[folder]++;
            if(counterObj[folder] === array.length) {
              folderCounter++;
              if(folderCounter === folders.length) {
                callback(array);
              }
            }
          };
        });
      });
    });
  });
};

// Fallback synchronous method. It works.
// exports.retrieveByIdArray = function(array, callback) {
//   let returnArray = array;
//   array.forEach(function(filename,index){
//     let type = filename.replace(/\d+.json/, "");
//     let exists = fs.existsSync(Store.path + type + '/' + filename);
//     if(exists) {
//       returnArray[index] = JSON.parse(fs.readFileSync(Store.path + type + '/' + filename));
//     } ;
//   });
//   callback(returnArray);
// };
