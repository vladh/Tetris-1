do ->
  document.addEventListener 'DOMContentLoaded', ->
    game = new Game {
      tetrisCanvas: document.getElementById('tetrisCanvas')
      holdCanvas: document.getElementById('holdCanvas')
      nextCanvas: document.getElementById('nextCanvas')
      lineSpan: document.getElementById('lines')
    }
    game.initGame()
    document.addEventListener 'keydown', game.keyboardInput.bind(game), false

    document.getElementById('startTetrisButton').onclick = () ->
      game = new Game {
        tetrisCanvas: document.getElementById('tetrisCanvas')
        holdCanvas: document.getElementById('holdCanvas')
        nextCanvas: document.getElementById('nextCanvas')
        lineSpan: document.getElementById('lines')
      }
      game.initGame()
      document.addEventListener 'keydown', game.keyboardInput.bind(game), false
