/**
 * Author: Rudi Strydom
 * Date: November 2014
 * Purpose: The purpose of this module is to minify my CSS and JS assets on a deploy.
 * Currently my deploy is done with the use of a Git Hook.
 * This would then be an additional step in this process.
 */

// Required Packages
var path      = require('path');
var gulp      = require('gulp');
var uglify    = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var rename    = require('gulp-rename');
var util      = require('gulp-util');
var imagemin  = require('gulp-imagemin');
var cache     = require('gulp-cache');

// Required system wide variables
global.appWebRoot   = '/usr/share/nginx';
global.appRoot      = '/usr/share/nginx/**';
global.jsAssetRoot  = global.appRoot + '/assets/js/out';
global.cssAssetRoot = global.appRoot + '/assets/css/out';
global.jsAssets     = global.jsAssetRoot + '/*.js';
global.cssAssets    = global.cssAssetRoot + '/*.css';
global.jsMinAssets  = global.jsAssetRoot + '/*.min.js';
global.cssMinAssets = global.cssAssetRoot + '/*.min.css';
global.imgAssets    = global.appRoot + '/assets/img';


/**
 * Minify all JS Assets, except already minified files
 *
 * @returns stream Gulp file stream object
 */
gulp.task('scripts', function() {

    return gulp.src([ global.jsAssets, '!' + global.jsMinAssets ], {base: global.appWebRoot})
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(global.appWebRoot))
        .on('error', util.log);
});

/**
 * Minify all CSS assets, excluding already minified CSS files
 *
 * @returns stream Gulp file stream object
 */
gulp.task('styles', function() {

    return gulp.src([ global.cssAssets, '!' + global.cssMinAssets ], {base: global.appWebRoot})
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(global.appWebRoot))
        .on('error', util.log);
});


/**
 * Compress all image assets on the fly
 *
 * @returns stream Gulp file stream object
 */
gulp.task('images', function() {

    return gulp.src([ '!' + global.imgAssets + '/out/**/*', global.imgAssets + "/**/*" ], {base: global.imgAssets })
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(global.imgAssets + "/out"))
        .on('error', util.log);
});

gulp.task('default', function() {
  gulp.start('scripts', 'styles');
});
