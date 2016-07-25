const fs = require('fs');

exports = module.exports = {};

exports.setPath = function(path) {
  exports.path = path;
};

exports.create = function(type, data, callback) {
  checkExists(exports.path, function() {
    checkExists(exports.path + type, function() {
      nextAvailable(exports.path + type + '/' + type, 0, function(name) {
        // console.log('Writing file:', name);
        const stringifiedData = JSON.stringify(data);
        fs.writeFile(name, stringifiedData, callback);
      });
    });
  });
};

function checkExists(path,callback) {
  fs.exists(path, function(exists) {
    if (exists) {
      callback();
    } else {
      fs.mkdir(path, callback);
    }
  });
}

function nextAvailable(stub, counter, callback) {
  fs.exists(stub + counter + '.json', function(exists) {
    if(!exists) {
      callback(stub + counter + '.json');
    } else {
      nextAvailable(stub, ++counter, callback);
    }
  });
}