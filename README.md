# Code Fellows 401 Lab Parallel File Processing

Driver: Geoffrey Emerson  
Navigator : Charles Emrich

### API calls

- Store.setPath(path) : requires a path ending in a forward slash. Sets the base directory which type directories will go in.
- Store.create(type, data, callback) : type is a string descriptor, data is any object

- Read.read(path, callback) : path is the location of an existing file
- Read.retrieveByType(type, callback) : type is a string descriptor
- Read.retrieveByIdArray(array, callback) : array is an array of file name strings