var ipc = require('ipc');

var currentDocument;
var pages = document.getElementById('pages');
var articles = document.getElementById('articles');
var documentlist = document.getElementById('documentlist');
var editor = document.getElementById('editor');
var mediumEditor = new MediumEditor(editor);

var onDocumentClick = function(){
    if(this.path !== currentDocument){
        editor.innerHTML = this.body;
        currentDocument = this.path;
    }
};

editor.addEventListener('input', function(){
    ipc.send('autosave', {path: currentDocument, content: editor.innerHTML});
});

var renderList = function(element, list){
    list.forEach(function(item){
        var title = item.attributes.title || 'Untitled';
        var li = document.createElement('li');
        li.innerHTML = '' + item.basename + ' - ' + title;
        li.addEventListener('click', onDocumentClick.bind(item));
        element.appendChild(li);
    });
};

ipc.on('render', function(data){
    renderList(articles, data.articles);
    renderList(pages, data.pages);
});
