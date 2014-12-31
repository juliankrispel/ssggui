var Promise = require('bluebird');
var config = require('./config');
var path = require('path');
var fs = require('./util').fs;
var fm = require('front-matter');

var parseDocuments = function(){
    return fm(file);
};

var parseDocumentFolder = function(folderPath){
    return fs.readdirAsync(folderPath)
        .map(function(file){
            return path.join(folderPath, file);
        })
        .map(function(file){
            return Promise.props({path: file, content: fs.readFileAsync(file, 'utf8')});
        })
        .map(function(file){
            var parsed = fm(file.content);
            parsed.basename = path.basename(file.path);
            parsed.path = file.path;
            return parsed;
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
