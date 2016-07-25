const assert = require('chai').assert;
const Store = require('../lib/create');
const create = Store.create;
const read = require('../lib/read');
const rimraf = require('rimraf');

const testPath = 'storage/';
const testTypeArray = ['tech_flying','tech_psychic', 'tech_ground'];
const testDataArray = [
  { name: 'Pidgey', type: 'flying' },
  { name: 'Abra', type: 'psychic' },
  { name: 'Diglett', type: 'ground' }
];
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
    });
  });

  it('retrieves all objects of a given type', function(done) {
    read.retrieveByType('tech_ground', function(data) {
      assert.deepEqual(testDataArray[2], data[0]);
      done();
    });
  });

  it('retrieves an array of objects in order by ID', function(done) {
    read.retrieveByIdArray(testIdArray, function(resultArray) {
      console.log('resultArray',resultArray);
      done();
    });
  });

  after(function(done) {
    // Warning: Deletes all storage
    // TODO: Create unique test folder or delete in a controlled manner
    rimraf( Store.path, err => {
      if (err) return done(err);
      done();
    });
  });
});
