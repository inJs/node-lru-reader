/**
 * Created by io_sys@126.com on 16/7/10.
 */

var path = require('path');
var extname = path.extname;
var join = path.join;

var fs = require('fs');

var LRU = require('lru-cache');
var cache;

var toString = Object.prototype.toString;
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

    if(!options || toString.call(options) !== '[object Object]') {

        options = {};
    }

    this.root = options.staticPath;
    this.ext = options.ext;

    if(options.enableCache === undefined) {
        options.enableCache = true;
    }

    this.enableCache = options.enableCache || process.env.NODE_ENV === 'production';

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

    if(!isSafe(this.root, file)) {

        this.notFound ? (file = this.notFound) : (callback(null, 'NOT FOUND'));

        file = join(this.root, file);
    }

    if((enableCache = this.enableCache) && (data = cache.get(file))) {

        return callback(null, data);
    }

    resolve(file, function(err, path) {
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