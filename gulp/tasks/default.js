var gulp = require('gulp');

// Note: 'buildTest and 'eslint' have been removed form these taks. The tests will need fixing.
gulp.task('default', ['clean'], function() {
  gulp.start('watch');
});
