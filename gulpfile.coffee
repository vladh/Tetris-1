gulp = require('gulp')
gutil = require('gulp-util')
concat = require('gulp-concat')
coffee = require('gulp-coffee')
handlebars = require('gulp-handlebars')
defineModule = require('gulp-define-module')
nib = require('nib')

handleErrors = (stream) ->
  stream.on 'error', ->
    gutil.log.apply(this, arguments)
    stream.end()

gulp.task 'coffee', ->
  gulp.src('./app/views/**/*.coffee')
      .pipe(handleErrors(coffee({bare: true})))
      .pipe(gulp.dest('./public/javascripts/'))

gulp.task 'handlebars', ->
  gulp.src(['./app/templates/**/*.hbs'])
      .pipe(handlebars({
        handlebars: require('handlebars')
      }))
      .pipe(defineModule('plain', {
        wrapper: 'Handlebars.templates = Handlebars.templates || {}; Handlebars.templates["<%= name %>"] = <%= handlebars %>'
      }))
      .pipe(gulp.dest('./public/templates/'))

gulp.task 'watch', ->
  gulp.watch('./app/views/**/*.coffee', ['coffee'])
  gulp.watch('./app/templates/**/*.hbs', ['handlebars'])

gulp.task('default', ['watch', 'coffee', 'handlebars'])
