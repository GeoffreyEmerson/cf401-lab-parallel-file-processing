const fs = require('fs');
const Store = require('../lib/create');

exports = module.exports;

exports.read = function(path, callback) {
  fs.readFile(Store.path + path, function(err,data) {
    console.log('read called');
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
// exports.retrieveByIdArray = function(array, callback) {
//   // Is there really no more efficient way of searching for files??
//   fs.readdir(Store.path, function(err,folders) {
//     console.log('folders',folders);
//     console.log('folders.length',folders.length);
//     let folderCounter = 0;
//     let counterObj = {};
//     folders.forEach(function(folder) {
//       console.log('currentFolder',folder);
//       fs.readdir(Store.path + folder, function(err,files) {
//         console.log('files',files);
//         console.log('files.length',files.length);
//         counterObj[folder] = 0;
//         console.log('counterObj['+ folder + ']:',counterObj[folder])
//         array.forEach(function(name,index) {
//           const matchIndex = files.indexOf(name);
//           console.log('Matching ' + name + ' against ' + files);
//           if(matchIndex !== -1) {
//             console.log('Matched!');
//             exports.read(Store.path + folder + '/' + files[matchIndex], function(err,data) {
//               if(err) console.log('error');
//               console.log('ping');
//               array[index] = data;
//               counterObj[folder]++;
//               if(counterObj[folder] === files.length) {
//                 folderCounter++;
//                 if(folderCounter === folders.length) callback(array);
//               };
//             })
//           } else {
//             counterObj[folder]++;
//             console.log('counterObj['+ folder + ']:',counterObj[folder])
//             if(counterObj[folder] === files.length) {
//               folderCounter++;
//               if(folderCounter === folders.length) {
//                 console.log('no matches');
//                 callback(array);
//               }
//             }
//           };
//         });
//       });
//     });
//   });
// };

// Fallback synchronous method. It works.
exports.retrieveByIdArray = function(array, callback) {
  let returnArray = array;
  array.forEach(function(filename,index){
    let type = filename.replace(/\d+.json/, "");
    let exists = fs.existsSync(Store.path + type + '/' + filename);
    if(exists) {
      returnArray[index] = JSON.parse(fs.readFileSync(Store.path + type + '/' + filename));
    } ;
  });
  callback(returnArray);
};
