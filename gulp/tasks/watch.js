var gulp = require('gulp');
var del = require('del');
gulp.task('watch', ['setWatch', 'browserSync'], function() {
	gulp.watch('src/**', ['sources']);
	//gulp.watch('examples/scripts/**', ['examples']);
});
