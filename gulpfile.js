var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

var browserSync = require('browser-sync').create();

var paths = {
    styles: {
        src: 'src/styles/*.sass',
        dest: 'css'
    },
    scripts: {
        src: 'src/scripts/*.js',
        dest: 'js'
    }
};

function clean(){
    return del([ paths.scripts.dest ]);
} 

function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(babel({
            presets: [
			    ['es2015', {modules: false}] // disable the strict mode
			]
        }))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function watch() {

    browserSync.init({
        server: {
            baseDir: "./",
            port: 3000,
            proxy: "http://localhost/k2/ot"
        }
		// when use with XAMPP remove server: and add only  proxy: "http://localhost/k2/ot"
    });

    gulp.watch(paths.scripts.src, gulp.parallel(scripts));
    gulp.watch("**/*.html").on('change', browserSync.reload);
    gulp.watch("**/*.php").on('change', browserSync.reload);
}

exports.clean = clean;
exports.scripts = scripts;
exports.watch = watch;

var build = gulp.series(clean, scripts, watch);
gulp.task('build', build);

gulp.task('default', build);