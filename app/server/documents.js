var Promise = require('bluebird');
var config = require('./config');
var path = require('path');
var fs = require('./util').fs;
var fm = require('front-matter');

var parseDocuments = function(){
    return fm(file);
};

var parseDocumentFolder = function(folderPath){
    return new Promise(function(fulfill, reject){
        fs.readdirAsync(folderPath)
            .map(function(file){
                return path.join(folderPath, file);
            })
            .map(function(file){
                return fs.readFileAsync(file, 'utf8');
            })
            .map(function(contents){
                return new Promise(function(){
                    fulfill(fm(contents));
                });
            });
    });
};

module.exports = {
    pages: function(){
        return config().then(function(conf){
            return parseDocumentFolder(conf.pagePath);
        });
    },
    articles: function(){
        return config().then(function(conf){
            return parseDocumentFolder(conf.articlePath);
        });
    },
    all: function(){
        var documents = {};
        for(var key in this){
            if(key !== 'all'){
                documents[key] = this[key]();
            }
        }
        return Promise.props(documents);
    }
};
