var Gulp = require('gulp'),

    Linoleum = require('linoleum');

require('linoleum-node');

Gulp.task('build', ['clean', 'lint'], function(done) {
  Linoleum.runTask('babel', done);
});
Gulp.task('cover', ['build'], function(done) {
  Linoleum.runTask(['cover:mocha', 'cover:report'], done);
});

const WATCH_FILES = Linoleum.jsFiles();
Linoleum.watch(WATCH_FILES, 'cover');

Gulp.task('watch', ['watch:cover']);
Gulp.task('default', ['cover']);
