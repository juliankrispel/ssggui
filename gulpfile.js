var gulp = require('gulp');
var template = require('gulp-template');
var connect = require('gulp-connect');
var _ = require('highland');
var include = require('gulp-include');

gulp.task('server', function(){
    connect.server({
        root: 'dist',
        port: 8383,
        livereload: true
    });
});

gulp.task('build', function () {
    var articles = gulp.src('articles/*.html')
        .pipe(_())
        .map(_.get('contents'))
        .invoke('toString');

    var pages = gulp.src('pages/*.html')
        .pipe(_())
        .map(_.get('contents'))
        .invoke('toString');

    var theme = gulp.src('theme/*.html')
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
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
    gulp.watch(['pages/*.*', 'theme/*.*', 'articles/*.*'], ['build']);
});

gulp.task('default', ['watch', 'build', 'server']);
