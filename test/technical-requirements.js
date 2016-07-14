const assert = require('assert');
const Store = require('../lib/create');
const create = Store.create;
const read = require('../lib/read');
const fs = require('fs');

// const testData = 'test_pidgey';
// const testType = 'test_flying';
const testPath = 'storage/';
const testTypeArray = ['tech_flying','tech_psychic', 'tech_ground'];
const testDataArray = [
  {
    name: 'Pidgey',
    type: 'flying'
  },
  {
    name: 'Abra',
    type: 'psychic'
  },
  {
    name: 'Diglett',
    type: 'ground'
  }];
const testIdArray = ['tech_flying0.json','tech_ground0.json'];

describe('Lab Technical Requirements', function() {

  it('configures a central directory at startup', function() {
    Store.setPath(testPath);
    if (Store.path !== testPath) throw new Error('Store.setPath() fail.');
  });

  it('stores objects by type under a folder', function(done) {
    let count = 0;
    testTypeArray.forEach(function(type,index){
      create(type, testDataArray[index], function(err) {
        if (err) throw new Error(err);
        count++;
        if (count === testTypeArray.length) done();
      });
    })
  });

  it('retrieves all objects of a given type', function(done) {
    read.retrieveByType('tech_ground', function(data) {
      console.log(data);
      done();
    });
  });

  it('retrieves an array of objects in order by ID', function(done) {
    read.retrieveByIdArray(testIdArray, function(resultArray) {
      console.log(resultArray);
      done();
    });
  });

  it('returns ID of object if duplicate', function() {
    // changes not done.

    // necessary changes:
    // create method would need to pull a list of all current files under that type.
    // iterate over each file found and check for deep equality.
    // return file name if equality found. Otherwise continue with method as is.
  });

  after(function() {
    fs.readdir(Store.path, function(err,folders) {
      const filteredFolders = folders.filter(function(folder) {
        if (folder.includes('tech_')) return true;
      })
      filteredFolders.forEach(function(folder) {
        fs.readdir(Store.path + folder, function(err,files) {
          files.forEach(function(file) {
            fs.unlinkSync(Store.path + folder + '/' + file);
          });
          fs.rmdirSync(Store.path + folder); //Yay
        });
      });
    });
  });
});
