var fs = require('fs');
module.exports = {
    getDirectories: function(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(p.join(path, file)).isDirectory();
        }).map(function(dir){
            return p.join(path, dir);
        });
    }
};
