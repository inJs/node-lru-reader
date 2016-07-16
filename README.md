# node-lru-reader based on LRU file reader

## Installation

`npm install node-lru-reader --save`

## Usage

```javascript
var opts = {
    staticPath: 'static path',
    ext: 'file extname',
    enableCache: [true], //if true or NODE_ENV === 'production', the cache enabled.
    notFound: 'when path is unsafe, it will be work.'
    cacheOpts: {
        //see[https://github.com/isaacs/node-lru-cache]
    }
};

// the default cache options
var defCacheOpts = {
    max: 1000,
    length: function(n, key) {

        return key.length;
    },
    maxAge: 1000 * 60 * 60 * 24
};

var reader = require('node-lru-reader')(opts);

var callback = function(err, data) {
 //todo stuff
}

reader.readFile(path, callback);
```
 
 

