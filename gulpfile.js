var gulp = require('gulp')
var inno = require('gulp-inno');
var electron = require('gulp-electron');

var gnf = require('./npm-files')
var pkg = require('./package.json')
var compileDir = './compile';

gulp.task('copy', ['copy:modules'], function(){
  return gulp.src(['main.js', 'package.json', 'index.html', 'icons/**/*'], {base: './'})
    .pipe(gulp.dest(compileDir))
})

gulp.task('copy:modules', function(){
  return gulp.src(gnf(), {base: './'}).pipe(gulp.dest(compileDir))
})

gulp.task('electron', function() {
  return gulp.src("")
    .pipe(electron({
      src: './compile',
      release: './release',
      cache: './.cache',
      packageJson: pkg,
      packaging: false,
      version: 'v0.35.1',
      platforms: ['win32-x64'], //'darwin-x64'],
      asar: true,
      asarUnpackDir: 'vendor',
      platformResources: {
        win: {
          "version-string": pkg.version,
          "file-version": pkg.version,
          "product-version": pkg.version,
          icon: 'icons/app.ico',
        },
        darwin: {
            CFBundleDisplayName: pkg.name,
            CFBundleIdentifier: pkg.name,
            CFBundleName: pkg.name,
            CFBundleVersion: pkg.version,
            icon: 'icons/app.icns',
        },
      }
    }))
    .pipe(gulp.dest(""));
})

gulp.task('copy-update', function(){
  return gulp.src('./scripts/update.exe').pipe(gulp.dest('./release/v0.35.1/win32-x64/'))
})

gulp.task('inno-setup', ['electron', 'copy-update'], function(){
  return gulp.src('./inno.iss').pipe(inno());
})

gulp.task('default', ['copy'])