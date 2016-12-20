'use strict';

// Dependencies
const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');

// Typescript
const tsProject = ts.createProject('tsconfig.json');

/**
 * Build the project.
 */
gulp.task('build', ['clean:dist'], () => {
  return gulp.src([...tsProject.config.files, './typings/index.d.ts'])
    .pipe(ts(tsProject))
    .pipe(concat('wcm.js'))
    .pipe(gulp.dest('dist'));
});

/**
 * Lint the project.
 */
gulp.task('lint', () => {
  return tsProject.src()
    .pipe(tslint({
      formatter: 'verbose'
    }))
    .pipe(tslint.report());
});

/**
 * Test the project.
 */
gulp.task('test', ['build'], () => {
  throw Error('Tests not yet defined');
});

/**
 * Generate the documentation
 */
gulp.task('docs', () => {
  return tsProject.src()
    .pipe(typedoc({
      out: 'docs',
      module: tsProject.config.compilerOptions.module,
      target: tsProject.config.compilerOptions.target,
      experimentalDecorators: tsProject.config.compilerOptions.experimentalDecorators
    }));
});

/**
 * Clean the dist folder.
 */
gulp.task('clean:dist', () => {
  return del('dist/*.js');
});
