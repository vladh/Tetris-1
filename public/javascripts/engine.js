(function() {
  return document.addEventListener('DOMContentLoaded', function() {
    var game;
    game = new Game({
      tetrisCanvas: document.getElementById('tetrisCanvas'),
      holdCanvas: document.getElementById('holdCanvas'),
      nextCanvas: document.getElementById('nextCanvas'),
      lineSpan: document.getElementById('lines')
    });
    game.initGame();
    document.addEventListener('keydown', game.keyboardInput.bind(game), false);
    return document.getElementById('startTetrisButton').onclick = function() {
      game = new Game({
        tetrisCanvas: document.getElementById('tetrisCanvas'),
        holdCanvas: document.getElementById('holdCanvas'),
        nextCanvas: document.getElementById('nextCanvas'),
        lineSpan: document.getElementById('lines')
      });
      game.initGame();
      return document.addEventListener('keydown', game.keyboardInput.bind(game), false);
    };
  });
})();
