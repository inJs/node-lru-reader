# node-lru-reader 基于LRU缓存的文件阅读器

## Installation

`npm install node-lru-reader --save`

## Usage

```javascript
var opts = {
    staticPath: '静态资源目录',
    ext: '文件后缀',
    enableCache: [true], //未配置该项时， NODE_ENV === 'production'时同样开启缓存
    notFound: '当超出静态目录范围或文件不存在时读取的文件'
    cacheOpts: {
        //此处配置请见[https://github.com/isaacs/node-lru-cache]
    }
};

// 未配置 cacheOpts 时， 该项默认配置为:
var defCacheOpts = {
    max: 1000,
    length: function(n, key) {

        return key.length;
    },
    maxAge: 1000 * 60 * 60 * 24
};

var reader = require('node-lru-reader')(opts);

reader.readFile(path, callback);
```
readFile 会为 callback 输出两个参数 `err, data`, 

