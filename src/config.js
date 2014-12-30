var Promise = require('bluebird');
var path = require('path');

var basePath = path.resolve('~/Documents/blog');

var config = {
    basePath: basePath,
    publicPath: path.join(basePath, 'public'),
    themePath: path.join(basePath, 'theme'),
    pagePath: path.join(basePath, 'pages'),
    articlePath: path.join(basePath, 'articles'),
    serverPort: 8383
};

var getConfig = function(){
    new Promise(function(fulfill, reject){
        fulfill(config);
    });
};

module.exports = getConfig;
