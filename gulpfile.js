var gulp = require('gulp');
var atomShell = require('gulp-atom-shell');

gulp.task('atom', function() {
    return gulp.src('app/**').pipe(atomshell({
        version: '0.19.4',
        outputPath: 'build',
        productName: 'Github Writer',
        productVersion: '0.0.1'
    }));
});

gulp.task('default', ['atom']);
