var ipc = require('ipc');
(function(){
    ipc.on('render', function(data){
        console.log('peng');
        console.log(data);
    });
})();

