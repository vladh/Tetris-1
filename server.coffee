app = require('./app')
debug = require('debug')('tetris:server')
http = require('http')

normalizePort = (val) ->
  ###
  Normalize a port into a number, string, or false.
  ###
  port = parseInt(val, 10)
  # named pipe
  return val if isNaN(port)
  # port number
  return port if port >= 0
  return false

onError = (error) ->
  ###
  Event listener for HTTP server "error" event.
  ###
  throw error if error.syscall != 'listen'

  if typeof port == 'string'
    bind = 'Pipe ' + port
  else
    bind = 'Port ' + port

  # Handle specific listen errors with friendly messages
  switch error.code
    when 'EACCES'
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    when 'EADDRINUSE'
      console.error(bind + ' is already in use')
      process.exit(1)
    else
      throw error

onListening = ->
  ###
  Event listener for HTTP server "listening" event.
  ###
  addr = server.address()
  if typeof addr == 'string'
    bind = 'Pipe ' + addr
  else
    bind = 'Port ' + addr.port
  debug('Listening on ' + bind)

port = normalizePort(process.env.PORT || '3002')
console.log("Listening on port: " + port);
app.set('port', port)

server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
