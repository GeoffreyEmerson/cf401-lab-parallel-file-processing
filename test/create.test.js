const assert = require('assert');
const Store = require('../lib/create');
const create = Store.create;
const read = require('../lib/read').read;
const fs = require('fs');

const testData = {
  name: 'Pidgey',
  type: 'flying'
};
const testType = 'test_type';
const testPath = 'storage/';

describe('Create and Read', function() {

  it('loads the create library', function() {
    assert.ok(create);
  });

  it('loads the read library', function() {
    assert.ok(read);
  });

  it('accepts a path for storage folder', function() {
    Store.setPath(testPath);
    if (Store.path !== testPath) throw new Error('Store.setPath() fail.');
  });

  it('creates a file', function(done) {
    create(testType, testData, function(err) {
      if (err) throw new Error(err);
      done();
    });
  });

  it('correctly stores data', function(done) {
    read('test_type/test_type0.json', function(err,data) {
      if(err) throw new Error(err);
      else {
        assert.deepEqual(data, testData, 'Does not compute.');
        done();
      };
    });
  });

  after(function() {
    fs.readdir(Store.path, function(err,folders) {
      const filteredFolders = folders.filter(function(folder) {
        if (folder.includes('test_')) return true;
      });
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
