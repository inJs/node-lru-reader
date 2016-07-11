# node-lru-reader 基于LRU缓存的文件阅读器

## Installation

`npm install node-lru-reader --save`

## Usage

```javascript
var opts = {
    staticPath: '静态资源目录',
    ext: '文件后缀',
    enableCache: '可选, 默认 true',
    notFound: '当超出静态目录范围或文件不存在时读取的文件'
    cacheOpts: {
        //此处配置请见[https://github.com/isaacs/node-lru-cache]
    }
};

var reader = require('node-lru-reader')(opts);

reader.readFile(path, callback);
```

