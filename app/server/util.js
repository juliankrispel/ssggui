var Promise = require('bluebird');

module.exports = {
    fs: Promise.promisifyAll(require('fs'))
};
