express = require('express')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
stylus = require('stylus')
nib = require('nib')

app = express()

app.set('views', path.join(__dirname, 'app/views'))
app.locals.basedir = app.get('views')
app.set('view engine', 'jade')

# uncomment after placing your favicon in /public
#app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(stylus.middleware({
  src: path.join(__dirname, 'app')
  dest: path.join(__dirname, 'public')
  compile: ((str, location) ->
    return stylus(str)
           .set('filename', location)
           .set('compress', true)
           .use(nib())
  )
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use (err, req, res, next) ->
  res.status(err.status || 500)
  error = {}
  if app.get('env') == 'development'
    error = err
  res.render('error', {
    message: err.message
    error: error
  })

require('./app/controllers')(app)

module.exports = app
