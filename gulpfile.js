var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var del = require('del');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

/*---------Server---------*/
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "docs/"
        }
    });

    gulp.watch('docs/**/*').on('change', browserSync.reload);

});

/*---------Pug-compile---------*/
gulp.task('templates:compile', function buildHTML() {
	return gulp.src('source/template/index.pug')
	.pipe(pug({
    	pretty: true
  	}))
  	.pipe(gulp.dest('docs/'));
});

/*---------Styles-compile---------*/
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('docs/css'));
});

/* ------------ JS ------------- */
gulp.task('js', function() {
  return gulp.src([
      'source/js/_init.js',
      'source/js/_validation.js',
      'source/js/_hero.js',
      'source/js/_scrolling.js',
      'source/js/_mobile_menu.js',
      'source/js/_form.js',
      'source/js/_testi.js',
      'source/js/main.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('docs/js'));
});

/* ------------ Delete ------------- */
gulp.task('clean', function () {
  return del(['build']);
});


/* ------------ Copy fonts ------------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('docs/fonts'));
});

/* ------------ Copy images ------------- */
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('docs/images'));
});

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* ------------ Watchers ------------- */
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
 gulp.watch('source/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'js', 'copy'),
  gulp.parallel('watch', 'server')
  )
);