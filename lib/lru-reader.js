/**
 * Created by Sanborn on 16/7/10.
 */

var path = require('path');
var extname = path.extname;
var join = path.join;

var fs = require('fs');

var LRU = require('lru-cache');
var cache;

var toString = Object.toString;
var defCacheOpts = {
    max: 1000,
    length: function(n, key) {

        return key.length;
    },
    maxAge: 1000 * 60 * 60 * 24
};

var LRUReader = function(options) {
    if(!(this instanceof LRUReader)) {

        return new LRUReader(options);
    }

    if(!options || toString.call(options) !== '[Object object]') {

        options = {};
    }

    this.root = options.static;
    this.ext = options.ext;

    if(options.enableCache === undefined) {
        options.enableCache = true;
    }

    this.enableCache = options.enableCache && process.env.NODE_ENV === 'production';

    if(this.enableCache) {
        cache = LRU(options.cacheOpts || defCacheOpts);
    }

    this.notFound = options.notFound;
};

LRUReader.prototype.readFile = function(file, callback) {
    if(!extname(file) || extname(file) !== this.ext) {
        file += this.ext;
    }

    var data;
    var enableCache;

    var realPath = join(this.root, file);

    if(!isSafe(this.root, realPath)) {

        this.notFound ? (file = this.notFound) : (callback(null, 'NOT FOUND'));

        realPath = join(this.root, file);
    }

    if((enableCache = this.enableCache) && (data = cache.get(realPath))) {

        return callback(null, data);
    }

    resolve(realPath, function(err, path) {
        if(err) {
            return callback(err);
        }

        fs.readFile(path, 'utf8', function(err, data) {
            if(err) {
                return callback(err);
            }

            if(enableCache) {
                cache.set(path, data);
            }

            callback(err, data)
        });
    });
};

function isSafe(staticPath, filename) {

    return ~filename.indexOf(staticPath);
}

function resolve(path, callback) {

    fs.stat(path, function(err, stats) {
        if(!err && stats.isFile()) {
           return callback(err, path);
        }

        callback(err, undefined);
    });
}

module.exports = LRUReader;