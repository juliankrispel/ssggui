var gulp = require('gulp');
var template = require('gulp-template');
var connect = require('gulp-connect');
var _ = require('highland');
var include = require('gulp-include');
var config = require('./config');
var path = require('path');

// wrapping all build functions in the config promise, 
// so that whenever they're called we ensure that config
// is present
var wrapConfig = function(func){
    return function(){
        config().then(func.bind(module.exports));
    };
};

module.exports = {

    server: wrapConfig(function(conf){
        connect.server({
            root: conf.publicPath,
            port: conf.serverPort
        });
    }),

    build: wrapConfig(function(conf){
        var articles = gulp.src(path.join(conf.articlePath, '*.html'))
            .pipe(_())
            .map(_.get('contents'))
            .invoke('toString');

        var pages = gulp.src(path.join(conf.pagePath, '*.html'))
            .pipe(_())
            .map(_.get('contents'))
            .invoke('toString');

        var theme = gulp.src(path.join(conf.themePath, '*.html'))
            .pipe(include())
            .pipe(_());

        return _([articles, pages, theme])
        .invoke('collect')
        .parallel(10)
        .collect()
        .map(function(result){
            var articles = result[0];
            var pages = result[1];
            var theme = result[2];

            var data = {
                title: 'Julians Blog',
                articles: articles,
                pages: pages,
            };

            return _(theme).map(function(th){
                th.data = data;
                return th;
            });
        })
        .flatten()
        .pipe(template())
        .pipe(connect.reload())
        .pipe(gulp.dest(conf.publicPath));
    }),

    watch: wrapConfig(function(conf){
        var paths = [conf.pagePath, conf.articlePath, conf.themePath].map(function(p){
            return path.join(p, '**/*.*');
        });
        gulp.watch(paths, this.build);
    }),

    all: function(){
        this.watch();
        this.build();
        this.server();
    }
};

module.exports.all();
