const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const sass = require('gulp-sass')(require('sass'));
const shell = require('gulp-shell');


gulp.task('js', function (done) {
    return browserify('_source/assets/js/main.js')
        .transform(babelify, {
            presets: ['@babel/preset-env']
        })
        .bundle()
        .pipe(source('app.js')) // Converts To Vinyl Stream
        .pipe(buffer()) // Converts Vinyl Stream To Vinyl Buffer
        // Gulp Plugins Here!
        //.pipe(uglify())
        .pipe(gulp.dest('_source/assets/js'))
        done();
});

gulp.task('sass', function (done) {
    gulp.src('_source/assets/css/*.scss')
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('_source/assets/css'))
    done();
});

// gulp.task('images', function (done) {
//     gulp.src('_source/assets/images/*')
//     .pipe(gulp.dest('_source/assets/images'));
//     done();
// });

// gulp.task('fonts', function (done) {
//     gulp.src('_source/_assets/source/fonts/*')
//     .pipe(gulp.dest('_source/assets/fonts'));
//     done();
// });

// gulp.task('lib', function (done) {
//     gulp.src('_source/_assets/source/js/lib/*')
//     .pipe(gulp.dest('_source/assets/js/lib'));
//     done();
// });

gulp.task('eleventy', shell.task('eleventy'));

// gulp.task('clean:postbuild', function () {
//     return del('_source/assets/**/*');
// });

gulp.task('watch', () => {
    gulp.watch('_source/assets/css/**/*', gulp.series('default'));
    gulp.watch('_source/assets/fonts/**/*', gulp.series('default'));
    gulp.watch('_source/assets/images/**/*', gulp.series('default'));
    gulp.watch('_source/assets/js/**/*', gulp.series('default'));
    gulp.watch('_source/_includes/**/*', gulp.series('default'));
    gulp.watch('_source/posts/**/*', gulp.series('default'));
});

gulp.task('default', gulp.series('js', 'sass', 'eleventy'));

gulp.task('build', gulp.series('default', 'watch'));