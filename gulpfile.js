var babel = require('gulp-babel');
var del = require('del');
var gulp = require('gulp');

gulp.task('clean', function () {
	return del.sync(['./bin/*']);
});

gulp.task('build', ['clean'], function () {
	return gulp.src('./src/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.on('error', function (error) {
			console.log(error.toString());
			this.emit('end');
		})
		.pipe(gulp.dest('./bin'));
});

gulp.task('watch', ['build'], function () {
	gulp.watch('./src/**/*.js', ['build']);
});
