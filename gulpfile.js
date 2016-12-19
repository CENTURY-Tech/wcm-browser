'use strict';

// Dependencies
const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');

// Typescript
const tsProject = ts.createProject('tsconfig.json');

/**
 * Build the project.
 */
gulp.task('build', ['clean:dist'], () => {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('dist'));
});

/**
 * Lint the project.
 */
gulp.task('lint', () => {
  return tsProject.src()
    .pipe(tslint({
      formatter: 'verbose'
    }))
    .pipe(tslint.report())
});

/**
 * Test the project.
 */
gulp.task('test', ['build'], () => {
  throw Error('Tests not yet defined');
});

/**
 * Clean the dist folder.
 */
gulp.task('clean:dist', () => {
  return del('dist/*.js');
});
