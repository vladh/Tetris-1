home = (req, res, next) ->
  res.render('home')

module.exports = (app) ->
  app.get('/', home)

  send404 = (req, res, next) ->
    res.status(404).format({
      html: ->
        res.render('error', {
          message: 'Could not find ' + req.url
          error: {}
        })
      json: ->
        res.type('json').send({error: 'Not found.'})
      text: ->
        res.type('txt').send('Not found.')
    })

  app.use(send404)
