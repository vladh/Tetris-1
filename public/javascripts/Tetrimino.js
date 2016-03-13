(function() {
  var Tetrimino;
  Tetrimino = {};
  Tetrimino.makeI = function() {
    var tetrimino;
    tetrimino = {};
    tetrimino.state1 = [[1, 1, 1, 1]];
    tetrimino.state2 = [[1], [1], [1], [1]];
    tetrimino.states = [tetrimino.state1, tetrimino.state2];
    tetrimino.currentState = 0;
    tetrimino.gridX = 3;
    tetrimino.gridY = 0;
    tetrimino.fillColor = '#29F0EF';
    tetrimino.strokeColor = '#24D8D7';
    tetrimino.name = "i";
    return tetrimino;
  };
  Tetrimino.makeBlock = function() {
    var tetrimino;
    tetrimino = {};
    tetrimino.state1 = [[1, 1], [1, 1]];
    tetrimino.states = [tetrimino.state1];
    tetrimino.currentState = 0;
    tetrimino.gridX = 4;
    tetrimino.gridY = 0;
    tetrimino.fillColor = '#F0EE33';
    tetrimino.strokeColor = '#D8D62D';
    tetrimino.name = "block";
    return tetrimino;
  };
  Tetrimino.makeZ = function() {
    var tetrimino;
    tetrimino = {};
    tetrimino.state1 = [[1, 1, 0], [0, 1, 1]];
    tetrimino.state2 = [[0, 1], [1, 1], [1, 0]];
    tetrimino.states = [tetrimino.state1, tetrimino.state2];
    tetrimino.currentState = 0;
    tetrimino.gridX = 3;
    tetrimino.gridY = 0;
    tetrimino.fillColor = '#ED0A18';
    tetrimino.strokeColor = '#D30915';
    tetrimino.name = "z";
    return tetrimino;
  };
  Tetrimino.makeS = function() {
    var tetrimino;
    tetrimino = {};
    tetrimino.state1 = [[0, 1, 1], [1, 1, 0]];
    tetrimino.state2 = [[1, 0], [1, 1], [0, 1]];
    tetrimino.states = [tetrimino.state1, tetrimino.state2];
    tetrimino.currentState = 0;
    tetrimino.gridX = 3;
    tetrimino.gridY = 0;
    tetrimino.fillColor = '#26EE2B';
    tetrimino.strokeColor = '#21D625';
    tetrimino.name = "s";
    return tetrimino;
  };
  Tetrimino.makeT = function() {
    var tetrimino;
    tetrimino = {};
    tetrimino.state1 = [[0, 1, 0], [1, 1, 1]];
    tetrimino.state2 = [[1, 0], [1, 1], [1, 0]];
    tetrimino.state3 = [[1, 1, 1], [0, 1, 0]];
    tetrimino.state4 = [[0, 1], [1, 1], [0, 1]];
    tetrimino.states = [tetrimino.state1, tetrimino.state2, tetrimino.state3, tetrimino.state4];
    tetrimino.currentState = 0;
    tetrimino.gridX = 3;
    tetrimino.gridY = 0;
    tetrimino.fillColor = '#9F22EC';
    tetrimino.strokeColor = '#8F1ED5';
    tetrimino.name = "t";
    return tetrimino;
  };
  Tetrimino.makeL = function() {
    var tetrimino;
    tetrimino = {};
    tetrimino.state1 = [[0, 0, 1], [1, 1, 1]];
    tetrimino.state2 = [[1, 0], [1, 0], [1, 1]];
    tetrimino.state3 = [[1, 1, 1], [1, 0, 0]];
    tetrimino.state4 = [[1, 1], [0, 1], [0, 1]];
    tetrimino.states = [tetrimino.state1, tetrimino.state2, tetrimino.state3, tetrimino.state4];
    tetrimino.currentState = 0;
    tetrimino.gridX = 3;
    tetrimino.gridY = 0;
    tetrimino.fillColor = '#EE9F26';
    tetrimino.strokeColor = '#D58E20';
    tetrimino.name = "l";
    return tetrimino;
  };
  Tetrimino.makeJ = function() {
    var tetrimino;
    tetrimino = {};
    tetrimino.state1 = [[1, 0, 0], [1, 1, 1]];
    tetrimino.state2 = [[1, 1], [1, 0], [1, 0]];
    tetrimino.state3 = [[1, 1, 1], [0, 0, 1]];
    tetrimino.state4 = [[0, 1], [0, 1], [1, 1]];
    tetrimino.states = [tetrimino.state1, tetrimino.state2, tetrimino.state3, tetrimino.state4];
    tetrimino.currentState = 0;
    tetrimino.gridX = 3;
    tetrimino.gridY = 0;
    tetrimino.fillColor = '#0820EC';
    tetrimino.strokeColor = '#061CD4';
    tetrimino.name = "j";
    return tetrimino;
  };
  Tetrimino.getRandomTetrimino = function() {
    var tetrimino, tetriminoIndex;
    tetriminoIndex = Math.floor(Math.random() * 7);
    switch (tetriminoIndex) {
      case 0:
        return tetrimino = Tetrimino.makeI();
      case 1:
        return tetrimino = Tetrimino.makeBlock();
      case 2:
        return tetrimino = Tetrimino.makeZ();
      case 3:
        return tetrimino = Tetrimino.makeS();
      case 4:
        return tetrimino = Tetrimino.makeT();
      case 5:
        return tetrimino = Tetrimino.makeL();
      case 6:
        return tetrimino = Tetrimino.makeJ();
    }
  };
  return window.Tetrimino = Tetrimino;
})();
