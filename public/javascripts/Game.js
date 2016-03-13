var Game,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Game = (function() {
  Game.prototype.tetrisCanvas = null;

  Game.prototype.holdCanvas = null;

  Game.prototype.nextCanvas = null;

  Game.prototype.tetrisContext = null;

  Game.prototype.nextContext = null;

  Game.prototype.lineSpan = null;

  Game.prototype.shouldTick = null;

  Game.prototype.isGameOver = false;

  Game.prototype.isHoldEmpty = true;

  Game.prototype.grid = null;

  Game.prototype.nextGrid = null;

  Game.prototype.holdGrid = null;

  Game.prototype.shadowGrid = null;

  Game.prototype.shadowGridY = null;

  Game.prototype.gridFillColor = null;

  Game.prototype.gridStrokeColor = null;

  Game.prototype.nextGridFillColor = null;

  Game.prototype.nextGridStrokeColor = null;

  Game.prototype.holdGridFillColor = null;

  Game.prototype.holdGridStrokeColor = null;

  Game.prototype.nextTetriminosArray = null;

  Game.prototype.holdTetrimino = null;

  Game.prototype.tetrisContext = null;

  Game.prototype.nextContext = null;

  Game.prototype.holdContext = null;

  Game.prototype.noRowsTetris = 20;

  Game.prototype.noColumnsTetris = 10;

  Game.prototype.noRowsHold = 4;

  Game.prototype.noColumnsHold = 6;

  Game.prototype.noRowsNext = 10;

  Game.prototype.noColumnsNext = 6;

  Game.prototype.boxSize = 26;

  Game.prototype.noLinesCleared = 0;

  Game.prototype.currentTime = null;

  Game.prototype.previousTime = null;

  Game.prototype.currentTetrimino = null;

  Game.prototype.refreshInterval = 500;

  function Game(arg) {
    var col, i, indexCol, indexRow, j, k, l, len, len1, len2, len3, len4, len5, m, n, ref, ref1, ref2, ref3, ref4, ref5, row;
    this.tetrisCanvas = arg.tetrisCanvas, this.holdCanvas = arg.holdCanvas, this.nextCanvas = arg.nextCanvas, this.lineSpan = arg.lineSpan;
    this.tetrisContext = this.tetrisCanvas.getContext('2d');
    this.nextContext = this.nextCanvas.getContext('2d');
    this.holdContext = this.holdCanvas.getContext('2d');
    this.tetrisCanvas.width = this.boxSize * this.noColumnsTetris;
    this.tetrisCanvas.height = this.boxSize * this.noRowsTetris;
    this.holdCanvas.width = this.boxSize * this.noColumnsHold;
    this.holdCanvas.height = this.boxSize * this.noRowsHold;
    this.nextCanvas.width = this.boxSize * this.noColumnsNext;
    this.nextCanvas.height = this.boxSize * this.noRowsNext;
    this.grid = new Array(this.noRowsTetris);
    this.gridFillColor = new Array(this.noRowsTetris);
    this.gridStrokeColor = new Array(this.noRowsTetris);
    this.shadowGrid = new Array(this.noRowsTetris);
    ref = this.grid;
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      this.grid[indexRow] = new Array(this.noColumnsTetris);
      this.shadowGrid[indexRow] = new Array(this.noColumnsTetris);
      this.gridFillColor[indexRow] = new Array(this.noColumnsTetris);
      this.gridStrokeColor[indexRow] = new Array(this.noColumnsTetris);
      ref1 = this.grid[indexRow];
      for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
        col = ref1[indexCol];
        this.grid[indexRow][indexCol] = 0;
        this.gridFillColor[indexRow][indexCol] = 0;
        this.gridStrokeColor[indexRow][indexCol] = 0;
        this.shadowGrid[indexRow][indexCol] = 0;
      }
    }
    this.nextGrid = new Array(this.noRowsNext);
    this.nextGridFillColor = new Array(this.noRowsNext);
    this.nextGridStrokeColor = new Array(this.noRowsNext);
    ref2 = this.nextGrid;
    for (indexRow = k = 0, len2 = ref2.length; k < len2; indexRow = ++k) {
      row = ref2[indexRow];
      this.nextGrid[indexRow] = new Array(this.noColumnsNext);
      this.nextGridFillColor[indexRow] = new Array(this.noColumnsNext);
      this.nextGridStrokeColor[indexRow] = new Array(this.noColumnsNext);
      ref3 = this.nextGrid[indexRow];
      for (indexCol = l = 0, len3 = ref3.length; l < len3; indexCol = ++l) {
        col = ref3[indexCol];
        this.nextGrid[indexRow][indexCol] = 0;
        this.nextGridFillColor[indexRow][indexCol] = 0;
        this.nextGridStrokeColor[indexRow][indexCol] = 0;
      }
    }
    this.holdGrid = new Array(this.noRowsHold);
    this.holdGridFillColor = new Array(this.noRowsHold);
    this.holdGridStrokeColor = new Array(this.noRowsHold);
    ref4 = this.holdGrid;
    for (indexRow = m = 0, len4 = ref4.length; m < len4; indexRow = ++m) {
      row = ref4[indexRow];
      this.holdGrid[indexRow] = new Array(this.noColumnsHold);
      this.holdGridFillColor[indexRow] = new Array(this.noColumnsHold);
      this.holdGridStrokeColor[indexRow] = new Array(this.noColumnsHold);
      ref5 = this.holdGrid[indexRow];
      for (indexCol = n = 0, len5 = ref5.length; n < len5; indexCol = ++n) {
        col = ref5[indexCol];
        this.holdGrid[indexRow][indexCol] = 0;
        this.holdGridFillColor[indexRow][indexCol] = 0;
        this.holdGridStrokeColor[indexRow][indexCol] = 0;
      }
    }
    this.displayNoLinesCleared();
    this.currentTime = this.previousTime = 0;
    this.shouldTick = true;
  }

  Game.prototype.initGame = function() {
    this.drawGridLines();
    this.drawBoard();
    this.currentTetrimino = Tetrimino.getRandomTetrimino();
    this.computeShadow(this.currentTetrimino);
    this.initNextTetriminos();
    return this.tick();
  };

  Game.prototype.displayNoLinesCleared = function() {
    return this.lineSpan.innerHTML = this.noLinesCleared.toString();
  };

  Game.prototype.initNextTetriminos = function() {
    this.nextTetriminosArray = [Tetrimino.getRandomTetrimino(), Tetrimino.getRandomTetrimino(), Tetrimino.getRandomTetrimino()];
    return this.addToNextGrid(this.nextTetriminosArray);
  };

  Game.prototype.addToNextGrid = function(tetriminosArray) {
    var col, i, index, indexCol, indexRow, j, k, len, len1, len2, offsetColumn, offsetRow, ref, ref1, results, row, tetrimino, tetriminoState;
    ref = this.nextGrid;
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      ref1 = this.nextGrid[indexRow];
      for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
        col = ref1[indexCol];
        this.nextGrid[indexRow][indexCol] = 0;
      }
    }
    results = [];
    for (index = k = 0, len2 = tetriminosArray.length; k < len2; index = ++k) {
      tetrimino = tetriminosArray[index];
      tetriminoState = tetrimino.currentState;
      offsetRow = index * 3 + 1;
      offsetColumn = 2;
      results.push((function() {
        var l, len3, ref2, results1;
        ref2 = tetrimino.states[tetriminoState];
        results1 = [];
        for (indexRow = l = 0, len3 = ref2.length; l < len3; indexRow = ++l) {
          row = ref2[indexRow];
          results1.push((function() {
            var len4, m, ref3, results2;
            ref3 = tetrimino.states[tetriminoState][indexRow];
            results2 = [];
            for (indexCol = m = 0, len4 = ref3.length; m < len4; indexCol = ++m) {
              col = ref3[indexCol];
              if (tetrimino.states[tetriminoState][indexRow][indexCol] === 1) {
                if (tetrimino.name === "i") {
                  offsetColumn = 1;
                  offsetRow = index * 3 + 2;
                }
                this.nextGrid[indexRow + offsetRow][indexCol + offsetColumn] = 1;
                this.nextGridFillColor[indexRow + offsetRow][indexCol + offsetColumn] = tetrimino.fillColor;
                results2.push(this.nextGridStrokeColor[indexRow + offsetRow][indexCol + offsetColumn] = tetrimino.strokeColor);
              } else {
                results2.push(void 0);
              }
            }
            return results2;
          }).call(this));
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Game.prototype.drawNextGrid = function() {
    var col, i, indexCol, indexRow, len, ref, results, row;
    ref = this.nextGrid;
    results = [];
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = this.nextGrid[indexRow];
        results1 = [];
        for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
          col = ref1[indexCol];
          if (this.nextGrid[indexRow][indexCol] !== 0) {
            results1.push(this.drawBox('next', indexCol, indexRow, this.nextGridFillColor[indexRow][indexCol], this.nextGridStrokeColor[indexRow][indexCol]));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Game.prototype.addToHoldGrid = function(tetrimino) {
    var col, i, indexCol, indexRow, j, k, len, len1, len2, offsetColumn, offsetRow, ref, ref1, ref2, results, row;
    this.isHoldEmpty = false;
    tetrimino.currentState = 0;
    this.holdTetrimino = tetrimino;
    ref = this.holdGrid;
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      ref1 = this.holdGrid[indexRow];
      for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
        col = ref1[indexCol];
        this.holdGrid[indexRow][indexCol] = 0;
      }
    }
    offsetRow = 1;
    offsetColumn = 2;
    ref2 = tetrimino.states[0];
    results = [];
    for (indexRow = k = 0, len2 = ref2.length; k < len2; indexRow = ++k) {
      row = ref2[indexRow];
      results.push((function() {
        var l, len3, ref3, results1;
        ref3 = tetrimino.states[0][indexRow];
        results1 = [];
        for (indexCol = l = 0, len3 = ref3.length; l < len3; indexCol = ++l) {
          col = ref3[indexCol];
          if (tetrimino.states[0][indexRow][indexCol] === 1) {
            if (tetrimino.name === "i") {
              offsetColumn = 1;
              offsetRow = 2;
            }
            this.holdGrid[indexRow + offsetRow][indexCol + offsetColumn] = 1;
            this.holdGridFillColor[indexRow + offsetRow][indexCol + offsetColumn] = tetrimino.fillColor;
            results1.push(this.holdGridStrokeColor[indexRow + offsetRow][indexCol + offsetColumn] = tetrimino.strokeColor);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Game.prototype.drawHoldGrid = function() {
    var col, i, indexCol, indexRow, len, ref, results, row;
    ref = this.holdGrid;
    results = [];
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = this.holdGrid[indexRow];
        results1 = [];
        for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
          col = ref1[indexCol];
          if (this.holdGrid[indexRow][indexCol] !== 0) {
            results1.push(this.drawBox('hold', indexCol, indexRow, this.holdGridFillColor[indexRow][indexCol], this.holdGridStrokeColor[indexRow][indexCol]));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Game.prototype.drawBox = function(context, x, y, fillColor, strokeColor) {
    if (context === 'tetris') {
      this.tetrisContext.closePath();
      this.tetrisContext.beginPath();
      this.tetrisContext.fillStyle = fillColor;
      this.tetrisContext.fillRect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
      this.tetrisContext.strokeStyle = strokeColor;
      this.tetrisContext.strokeRect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
    }
    if (context === 'next') {
      this.nextContext.closePath();
      this.nextContext.beginPath();
      this.nextContext.fillStyle = fillColor;
      this.nextContext.fillRect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
      this.nextContext.strokeStyle = strokeColor;
      this.nextContext.strokeRect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
    }
    if (context === 'hold') {
      this.holdContext.closePath();
      this.holdContext.beginPath();
      this.holdContext.fillStyle = fillColor;
      this.holdContext.fillRect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
      this.holdContext.strokeStyle = strokeColor;
      return this.holdContext.strokeRect(x * this.boxSize, y * this.boxSize, this.boxSize, this.boxSize);
    }
  };

  Game.prototype.getNextTetrimino = function() {
    var newTetrimino;
    newTetrimino = this.nextTetriminosArray[0];
    this.nextTetriminosArray[0] = this.nextTetriminosArray[1];
    this.nextTetriminosArray[1] = this.nextTetriminosArray[2];
    this.nextTetriminosArray[2] = Tetrimino.getRandomTetrimino();
    this.addToNextGrid(this.nextTetriminosArray);
    return newTetrimino;
  };

  Game.prototype.drawGridLines = function() {
    var i, index, j, ref, ref1, ref2, ref3, results;
    for (index = i = 0, ref = this.tetrisCanvas.width, ref1 = this.boxSize; ref1 > 0 ? i <= ref : i >= ref; index = i += ref1) {
      this.tetrisContext.beginPath();
      this.tetrisContext.moveTo(index, 0);
      this.tetrisContext.lineTo(index, this.tetrisCanvas.height);
      this.tetrisContext.strokeStyle = '#ecf0f1';
      this.tetrisContext.stroke();
    }
    results = [];
    for (index = j = 0, ref2 = this.tetrisCanvas.height, ref3 = this.boxSize; ref3 > 0 ? j <= ref2 : j >= ref2; index = j += ref3) {
      this.tetrisContext.beginPath();
      this.tetrisContext.moveTo(0, index);
      this.tetrisContext.lineTo(this.tetrisCanvas.width, index);
      this.tetrisContext.strokeStyle = '#ecf0f1';
      results.push(this.tetrisContext.stroke());
    }
    return results;
  };

  Game.prototype.drawBoard = function() {
    var col, i, indexCol, indexRow, len, ref, results, row;
    ref = this.grid;
    results = [];
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = this.grid[indexRow];
        results1 = [];
        for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
          col = ref1[indexCol];
          if (this.grid[indexRow][indexCol] !== 0) {
            this.drawBox('tetris', indexCol, indexRow, this.gridFillColor[indexRow][indexCol], this.gridStrokeColor[indexRow][indexCol]);
          }
          if (this.shadowGrid[indexRow][indexCol] !== 0) {
            results1.push(this.drawBox('tetris', indexCol, indexRow, '#bdc3c7', '#ecf0f1'));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Game.prototype.drawTetrimino = function(tetrimino, context) {
    var col, i, indexCol, indexRow, len, ref, results, row, tetriminoState, tetriminoX, tetriminoY;
    tetriminoX = tetrimino.gridX;
    tetriminoY = tetrimino.gridY;
    tetriminoState = tetrimino.currentState;
    ref = tetrimino.states[tetriminoState];
    results = [];
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = tetrimino.states[tetriminoState][indexRow];
        results1 = [];
        for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
          col = ref1[indexCol];
          if (tetrimino.states[tetriminoState][indexRow][indexCol] === 1 && tetriminoY >= 0) {
            results1.push(this.drawBox('tetris', tetriminoX + indexCol, tetriminoY + indexRow, tetrimino.fillColor, tetrimino.strokeColor));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Game.prototype.addToGrid = function(tetrimino) {
    var col, i, indexCol, indexRow, j, len, len1, ref, ref1, row, tetriminoState, tetriminoX, tetriminoY;
    tetriminoX = tetrimino.gridX;
    tetriminoY = tetrimino.gridY;
    tetriminoState = tetrimino.currentState;
    ref = tetrimino.states[tetriminoState];
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      ref1 = tetrimino.states[tetriminoState][indexRow];
      for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
        col = ref1[indexCol];
        if (tetrimino.states[tetriminoState][indexRow][indexCol] === 1 && tetriminoY >= 0) {
          this.grid[tetriminoY + indexRow][tetriminoX + indexCol] = 1;
          this.gridFillColor[tetriminoY + indexRow][tetriminoX + indexCol] = tetrimino.fillColor;
          this.gridStrokeColor[tetriminoY + indexRow][tetriminoX + indexCol] = tetrimino.strokeColor;
        }
      }
    }
    this.checkForFullLines();
    if (tetriminoY < 1) {
      return this.isGameOver = true;
    }
  };

  Game.prototype.checkForFullLines = function() {
    var indexCol, indexRow, isRowFull, results;
    indexRow = this.noRowsTetris - 1;
    indexCol = this.noColumnsTetris - 1;
    isRowFull = true;
    results = [];
    while (indexRow >= 0) {
      while (indexCol >= 0) {
        if (this.grid[indexRow][indexCol] === 0) {
          isRowFull = false;
          indexCol = -1;
        } else {
          indexCol--;
        }
      }
      if (isRowFull) {
        this.deleteLine(indexRow);
        indexRow++;
        this.noLinesCleared++;
        this.displayNoLinesCleared();
      }
      isRowFull = true;
      indexCol = this.noColumnsTetris - 1;
      results.push(indexRow--);
    }
    return results;
  };

  Game.prototype.deleteLine = function(indexLine) {
    var col, i, indexCol, indexRow, len, ref, results;
    indexRow = indexLine;
    indexCol = 0;
    results = [];
    while (indexRow >= 0) {
      ref = this.grid[indexRow];
      for (indexCol = i = 0, len = ref.length; i < len; indexCol = ++i) {
        col = ref[indexCol];
        if (indexRow !== 0) {
          this.grid[indexRow][indexCol] = this.grid[indexRow - 1][indexCol];
          this.gridFillColor[indexRow][indexCol] = this.gridFillColor[indexRow - 1][indexCol];
          this.gridStrokeColor[indexRow][indexCol] = this.gridStrokeColor[indexRow - 1][indexCol];
        } else {
          this.grid[indexRow][indexCol] = 0;
          this.gridFillColor[indexRow][indexCol] = 'white';
          this.gridStrokeColor[indexRow][indexCol] = '#ecf0f1';
        }
      }
      results.push(indexRow--);
    }
    return results;
  };

  Game.prototype.checkNextMove = function(xPos, yPos, stateToCheck, tetrimino) {
    var col, i, j, newGridX, newGridY, ref, ref1, row;
    newGridX = xPos;
    newGridY = yPos;
    for (row = i = 0, ref = tetrimino.states[stateToCheck].length; 0 <= ref ? i < ref : i > ref; row = 0 <= ref ? ++i : --i) {
      for (col = j = 0, ref1 = tetrimino.states[stateToCheck][row].length; 0 <= ref1 ? j < ref1 : j > ref1; col = 0 <= ref1 ? ++j : --j) {
        if (newGridX < 0 || newGridX >= this.noColumnsTetris) {
          return false;
        }
        if (newGridY < 0 || newGridY >= this.noRowsTetris) {
          return false;
        }
        if (this.grid[newGridY][newGridX + col] !== 0 && tetrimino.states[stateToCheck][row][col] !== 0) {
          return false;
        }
      }
      newGridY++;
    }
    return true;
  };

  Game.prototype.tick = function() {
    if (this.shouldTick) {
      this.updateGrid();
      if (this.isGameOver) {
        return this.drawGameOver();
      } else {
        return requestAnimationFrame(this.tick.bind(this));
      }
    } else {
      return requestAnimationFrame(this.tick.bind(this));
    }
  };

  Game.prototype.drawGameOver = function() {
    this.clearCanvases();
    this.drawGridLines();
    this.clearShadowGrid();
    this.tetrisContext.font = '185px gameOver';
    this.tetrisContext.fillText('GAME', this.boxSize, 7 * this.boxSize);
    return this.tetrisContext.fillText('OVER', this.boxSize, 11 * this.boxSize);
  };

  Game.prototype.clearCanvases = function() {
    this.tetrisContext.clearRect(0, 0, this.tetrisCanvas.width, this.tetrisCanvas.height);
    this.nextContext.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    return this.holdContext.clearRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
  };

  Game.prototype.updateGrid = function() {
    this.currentTime = new Date().getTime();
    if ((this.currentTime - this.previousTime) > this.refreshInterval) {
      if (this.checkNextMove(this.currentTetrimino.gridX, this.currentTetrimino.gridY + 1, this.currentTetrimino.currentState, this.currentTetrimino)) {
        this.currentTetrimino.gridY++;
      } else {
        this.addToGrid(this.currentTetrimino);
        this.currentTetrimino = this.getNextTetrimino();
        this.computeShadow(this.currentTetrimino);
        this.changeRefreshInterval(500);
      }
      this.previousTime = this.currentTime;
    }
    this.tetrisContext.clearRect(0, 0, this.tetrisCanvas.width, this.tetrisCanvas.height);
    this.nextContext.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    this.holdContext.clearRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
    this.drawGridLines();
    this.drawBoard();
    this.drawTetrimino(this.currentTetrimino);
    this.drawNextGrid();
    return this.drawHoldGrid();
  };

  Game.prototype.cycleState = function(tetrimino) {
    var currentState, newState;
    currentState = tetrimino.currentState;
    if (currentState === tetrimino.states.length - 1) {
      newState = 0;
    } else {
      newState = currentState + 1;
    }
    if (this.checkNextMove(tetrimino.gridX, tetrimino.gridY, newState, tetrimino)) {
      return newState;
    }
    return currentState;
  };

  Game.prototype.holdCurrentTetrimino = function() {
    var switchTetrimino;
    switchTetrimino = this.currentTetrimino;
    if (this.isHoldEmpty) {
      this.currentTetrimino = this.getNextTetrimino();
    } else {
      this.currentTetrimino = this.holdTetrimino;
      this.currentTetrimino.gridY = 0;
    }
    return this.addToHoldGrid(switchTetrimino);
  };

  Game.prototype.changeRefreshInterval = function(refreshIntervalValue) {
    return this.refreshInterval = refreshIntervalValue;
  };

  Game.prototype.addToShadowGrid = function(tetrimino, newGridY) {
    var col, i, indexCol, indexRow, len, ref, results, row, tetriminoState, tetriminoX, tetriminoY;
    this.clearShadowGrid();
    tetriminoX = tetrimino.gridX;
    tetriminoY = newGridY;
    tetriminoState = tetrimino.currentState;
    ref = tetrimino.states[tetriminoState];
    results = [];
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = tetrimino.states[tetriminoState][indexRow];
        results1 = [];
        for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
          col = ref1[indexCol];
          if (tetrimino.states[tetriminoState][indexRow][indexCol] === 1 && tetriminoY >= 0) {
            results1.push(this.shadowGrid[tetriminoY + indexRow][tetriminoX + indexCol] = 1);
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Game.prototype.clearShadowGrid = function() {
    var col, i, indexCol, indexRow, len, ref, results, row;
    ref = this.shadowGrid;
    results = [];
    for (indexRow = i = 0, len = ref.length; i < len; indexRow = ++i) {
      row = ref[indexRow];
      results.push((function() {
        var j, len1, ref1, results1;
        ref1 = this.shadowGrid[indexRow];
        results1 = [];
        for (indexCol = j = 0, len1 = ref1.length; j < len1; indexCol = ++j) {
          col = ref1[indexCol];
          results1.push(this.shadowGrid[indexRow][indexCol] = 0);
        }
        return results1;
      }).call(this));
    }
    return results;
  };

  Game.prototype.computeShadow = function(tetrimino) {
    this.shadowGridY = 1;
    while ((this.shadowGridY < this.noRowsTetris) && this.checkNextMove(tetrimino.gridX, this.shadowGridY, tetrimino.currentState, tetrimino)) {
      this.shadowGridY++;
    }
    return this.addToShadowGrid(tetrimino, this.shadowGridY - 1);
  };

  Game.prototype.keyboardInput = function() {
    var keyCodes, ref;
    keyCodes = {
      ESC: 27,
      SPACE: 32,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      CKEY: 67
    };
    if (ref = event.keyCode, indexOf.call(Helpers.objectValues(keyCodes), ref) >= 0) {
      event.preventDefault();
    }
    switch (event.keyCode) {
      case keyCodes.LEFT:
        if (this.checkNextMove(this.currentTetrimino.gridX - 1, this.currentTetrimino.gridY, this.currentTetrimino.currentState, this.currentTetrimino)) {
          this.currentTetrimino.gridX--;
          return this.computeShadow(this.currentTetrimino);
        }
        break;
      case keyCodes.RIGHT:
        if (this.checkNextMove(this.currentTetrimino.gridX + 1, this.currentTetrimino.gridY, this.currentTetrimino.currentState, this.currentTetrimino)) {
          this.currentTetrimino.gridX++;
          return this.computeShadow(this.currentTetrimino);
        }
        break;
      case keyCodes.DOWN:
        if (this.checkNextMove(this.currentTetrimino.gridX, this.currentTetrimino.gridY + 2, this.currentTetrimino.currentState, this.currentTetrimino)) {
          return this.currentTetrimino.gridY += 2;
        }
        break;
      case keyCodes.UP:
        this.currentTetrimino.currentState = this.cycleState(this.currentTetrimino);
        return this.computeShadow(this.currentTetrimino);
      case keyCodes.CKEY:
        this.holdCurrentTetrimino();
        return this.computeShadow(this.currentTetrimino);
      case keyCodes.SPACE:
        return this.currentTetrimino.gridY = this.shadowGridY - 1;
      case keyCodes.ESC:
        return this.shouldTick = !this.shouldTick;
    }
  };

  return Game;

})();
