class Game
  tetrisCanvas: null
  holdCanvas: null
  nextCanvas: null
  tetrisContext: null
  nextContext: null
  lineSpan: null
  shouldTick: null

  isGameOver: false
  isHoldEmpty: true

  grid: null
  nextGrid: null
  holdGrid: null

  shadowGrid: null
  shadowGridY: null

  gridFillColor: null
  gridStrokeColor: null

  nextGridFillColor: null
  nextGridStrokeColor: null

  holdGridFillColor: null
  holdGridStrokeColor: null

  nextTetriminosArray: null
  holdTetrimino: null

  tetrisContext: null
  nextContext: null
  holdContext: null

  noRowsTetris: 20
  noColumnsTetris: 10

  noRowsHold: 4
  noColumnsHold: 6

  noRowsNext: 10
  noColumnsNext: 6

  boxSize: 26
  noLinesCleared: 0

  currentTime: null
  previousTime: null

  currentTetrimino: null

  refreshInterval: 500

  constructor: ({@tetrisCanvas, @holdCanvas, @nextCanvas, @lineSpan}) ->
    @tetrisContext = @tetrisCanvas.getContext('2d')
    @nextContext = @nextCanvas.getContext('2d')
    @holdContext = @holdCanvas.getContext('2d')

    @tetrisCanvas.width = @boxSize * @noColumnsTetris
    @tetrisCanvas.height = @boxSize * @noRowsTetris

    @holdCanvas.width = @boxSize * @noColumnsHold
    @holdCanvas.height = @boxSize * @noRowsHold

    @nextCanvas.width = @boxSize * @noColumnsNext
    @nextCanvas.height = @boxSize * @noRowsNext

    @grid = new Array(@noRowsTetris)
    @gridFillColor = new Array(@noRowsTetris)
    @gridStrokeColor = new Array(@noRowsTetris)
    @shadowGrid = new Array(@noRowsTetris)

    for row, indexRow in @grid
      @grid[indexRow] = new Array(@noColumnsTetris)
      @shadowGrid[indexRow] = new Array(@noColumnsTetris)
      @gridFillColor[indexRow] = new Array(@noColumnsTetris)
      @gridStrokeColor[indexRow] = new Array(@noColumnsTetris)

      for col, indexCol in @grid[indexRow]
        @grid[indexRow][indexCol] = 0
        @gridFillColor[indexRow][indexCol] = 0
        @gridStrokeColor[indexRow][indexCol] = 0
        @shadowGrid[indexRow][indexCol] = 0

    @nextGrid = new Array(@noRowsNext)
    @nextGridFillColor = new Array(@noRowsNext)
    @nextGridStrokeColor  = new Array(@noRowsNext)

    for row, indexRow in @nextGrid
      @nextGrid[indexRow] = new Array(@noColumnsNext)
      @nextGridFillColor[indexRow] = new Array(@noColumnsNext)
      @nextGridStrokeColor[indexRow] = new Array(@noColumnsNext)

      for col, indexCol in @nextGrid[indexRow]
        @nextGrid[indexRow][indexCol] = 0
        @nextGridFillColor[indexRow][indexCol] = 0
        @nextGridStrokeColor[indexRow][indexCol] = 0

    @holdGrid = new Array(@noRowsHold)
    @holdGridFillColor = new Array(@noRowsHold)
    @holdGridStrokeColor  = new Array(@noRowsHold)

    for row, indexRow in @holdGrid
      @holdGrid[indexRow] = new Array(@noColumnsHold)
      @holdGridFillColor[indexRow] = new Array(@noColumnsHold)
      @holdGridStrokeColor[indexRow] = new Array(@noColumnsHold)

      for col, indexCol in @holdGrid[indexRow]
        @holdGrid[indexRow][indexCol] = 0
        @holdGridFillColor[indexRow][indexCol] = 0
        @holdGridStrokeColor[indexRow][indexCol] = 0

    @displayNoLinesCleared()

    @currentTime = @previousTime = 0

    @shouldTick = true

  initGame: ->
    @drawGridLines()
    @drawBoard()
    @currentTetrimino = Tetrimino.getRandomTetrimino()
    @computeShadow(@currentTetrimino)
    @initNextTetriminos()
    @tick()

  displayNoLinesCleared: ->
    @lineSpan.innerHTML = @noLinesCleared.toString()

  initNextTetriminos: ->
    @nextTetriminosArray = [
      Tetrimino.getRandomTetrimino()
      Tetrimino.getRandomTetrimino()
      Tetrimino.getRandomTetrimino()
    ]

    @addToNextGrid(@nextTetriminosArray)

  addToNextGrid: (tetriminosArray) ->
    for row, indexRow in @nextGrid
      for col, indexCol in @nextGrid[indexRow]
        @nextGrid[indexRow][indexCol] = 0

    for tetrimino, index in tetriminosArray
      tetriminoState = tetrimino.currentState
      offsetRow = index * 3 + 1
      offsetColumn = 2
      for row, indexRow in tetrimino.states[tetriminoState]
        for col, indexCol in tetrimino.states[tetriminoState][indexRow]
          if tetrimino.states[tetriminoState][indexRow][indexCol] is 1
            if tetrimino.name is "i"
              offsetColumn = 1
              offsetRow = index * 3 + 2
            @nextGrid[indexRow + offsetRow][indexCol + offsetColumn] = 1
            @nextGridFillColor[indexRow + offsetRow][indexCol + offsetColumn] = tetrimino.fillColor
            @nextGridStrokeColor[indexRow + offsetRow][indexCol + offsetColumn] = tetrimino.strokeColor

  drawNextGrid: ->
    for row, indexRow in @nextGrid
      for col, indexCol in @nextGrid[indexRow]
        if @nextGrid[indexRow][indexCol] isnt 0
          @drawBox('next', indexCol, indexRow,
                  @nextGridFillColor[indexRow][indexCol],
                  @nextGridStrokeColor[indexRow][indexCol])

  addToHoldGrid: (tetrimino) ->
    @isHoldEmpty = false
    tetrimino.currentState = 0

    @holdTetrimino = tetrimino
    for row, indexRow in @holdGrid
      for col, indexCol in @holdGrid[indexRow]
        @holdGrid[indexRow][indexCol] = 0

    offsetRow = 1
    offsetColumn = 2
    for row, indexRow in tetrimino.states[0]
      for col, indexCol in tetrimino.states[0][indexRow]
        if tetrimino.states[0][indexRow][indexCol] is 1
          if tetrimino.name is "i"
            offsetColumn = 1
            offsetRow = 2
          @holdGrid[indexRow + offsetRow][indexCol + offsetColumn] = 1
          @holdGridFillColor[indexRow + offsetRow][indexCol + offsetColumn] = tetrimino.fillColor
          @holdGridStrokeColor[indexRow + offsetRow][indexCol + offsetColumn] = tetrimino.strokeColor

  drawHoldGrid: ->
    for row, indexRow in @holdGrid
      for col, indexCol in @holdGrid[indexRow]
        if @holdGrid[indexRow][indexCol] isnt 0
          @drawBox('hold', indexCol, indexRow,
                  @holdGridFillColor[indexRow][indexCol],
                  @holdGridStrokeColor[indexRow][indexCol])

  drawBox: (context, x, y, fillColor, strokeColor) ->
    if context is 'tetris'
      @tetrisContext.closePath()
      @tetrisContext.beginPath()
      @tetrisContext.fillStyle = fillColor
      @tetrisContext.fillRect(x * @boxSize, y * @boxSize, @boxSize, @boxSize)

      @tetrisContext.strokeStyle = strokeColor
      @tetrisContext.strokeRect(x * @boxSize, y * @boxSize, @boxSize, @boxSize)

    if context is 'next'
      @nextContext.closePath()
      @nextContext.beginPath()
      @nextContext.fillStyle = fillColor
      @nextContext.fillRect(x * @boxSize, y * @boxSize, @boxSize, @boxSize)

      @nextContext.strokeStyle = strokeColor
      @nextContext.strokeRect(x * @boxSize, y * @boxSize, @boxSize, @boxSize)

    if context is 'hold'
      @holdContext.closePath()
      @holdContext.beginPath()
      @holdContext.fillStyle = fillColor
      @holdContext.fillRect(x * @boxSize, y * @boxSize, @boxSize, @boxSize)

      @holdContext.strokeStyle = strokeColor
      @holdContext.strokeRect(x * @boxSize, y * @boxSize, @boxSize, @boxSize)

  getNextTetrimino: ->
    newTetrimino = @nextTetriminosArray[0]

    @nextTetriminosArray[0] = @nextTetriminosArray[1]
    @nextTetriminosArray[1] = @nextTetriminosArray[2]
    @nextTetriminosArray[2] = Tetrimino.getRandomTetrimino()

    @addToNextGrid(@nextTetriminosArray)

    return newTetrimino

  drawGridLines: ->
    for index in [0..@tetrisCanvas.width] by @boxSize
      @tetrisContext.beginPath()
      @tetrisContext.moveTo(index, 0)
      @tetrisContext.lineTo(index, @tetrisCanvas.height)
      @tetrisContext.strokeStyle = '#ecf0f1'
      @tetrisContext.stroke()

    for index in [0..@tetrisCanvas.height] by @boxSize
      @tetrisContext.beginPath()
      @tetrisContext.moveTo(0, index)
      @tetrisContext.lineTo(@tetrisCanvas.width, index)
      @tetrisContext.strokeStyle = '#ecf0f1'
      @tetrisContext.stroke()

  drawBoard: ->
    for row, indexRow in @grid
      for col, indexCol in @grid[indexRow]
        if @grid[indexRow][indexCol] isnt 0
          @drawBox('tetris', indexCol, indexRow,
                  @gridFillColor[indexRow][indexCol],
                  @gridStrokeColor[indexRow][indexCol])
        if @shadowGrid[indexRow][indexCol] isnt 0
          @drawBox('tetris', indexCol, indexRow, '#bdc3c7', '#ecf0f1')

  drawTetrimino: (tetrimino, context) ->
    tetriminoX = tetrimino.gridX
    tetriminoY = tetrimino.gridY

    tetriminoState = tetrimino.currentState

    for row, indexRow in tetrimino.states[tetriminoState]
      for col, indexCol in tetrimino.states[tetriminoState][indexRow]
        if tetrimino.states[tetriminoState][indexRow][indexCol] is 1 and
        tetriminoY >= 0
            @drawBox('tetris', (tetriminoX + indexCol), (tetriminoY + indexRow), tetrimino.fillColor, tetrimino.strokeColor)

  addToGrid: (tetrimino) ->
    tetriminoX = tetrimino.gridX
    tetriminoY = tetrimino.gridY

    tetriminoState = tetrimino.currentState

    for row, indexRow in tetrimino.states[tetriminoState]
      for col, indexCol in tetrimino.states[tetriminoState][indexRow]
        if tetrimino.states[tetriminoState][indexRow][indexCol] is 1 and
        tetriminoY >= 0
          @grid[tetriminoY + indexRow][tetriminoX + indexCol] = 1
          @gridFillColor[tetriminoY + indexRow][tetriminoX + indexCol] = tetrimino.fillColor
          @gridStrokeColor[tetriminoY + indexRow][tetriminoX + indexCol] = tetrimino.strokeColor

    @checkForFullLines()

    if tetriminoY < 1
      @isGameOver = true

  checkForFullLines: ->
    indexRow = @noRowsTetris - 1
    indexCol = @noColumnsTetris - 1
    isRowFull = true

    while indexRow >= 0
      while indexCol >= 0
        if @grid[indexRow][indexCol] is 0
          isRowFull = false
          indexCol = -1
        else
          indexCol--

      if isRowFull
        @deleteLine(indexRow)
        indexRow++
        @noLinesCleared++
        @displayNoLinesCleared()

      isRowFull = true
      indexCol = @noColumnsTetris - 1
      indexRow--

  deleteLine: (indexLine) ->
    indexRow = indexLine
    indexCol = 0

    while indexRow >= 0
      for col, indexCol in @grid[indexRow]
        if indexRow isnt 0
          @grid[indexRow][indexCol] = @grid[indexRow - 1][indexCol]
          @gridFillColor[indexRow][indexCol] = @gridFillColor[indexRow - 1][indexCol]
          @gridStrokeColor[indexRow][indexCol] = @gridStrokeColor[indexRow - 1][indexCol]
        else
          @grid[indexRow][indexCol] = 0
          @gridFillColor[indexRow][indexCol] = 'white'
          @gridStrokeColor[indexRow][indexCol] = '#ecf0f1'
      indexRow--

  checkNextMove: (xPos, yPos, stateToCheck, tetrimino) ->
    newGridX = xPos
    newGridY = yPos

    for row in [0...tetrimino.states[stateToCheck].length]
      for col in [0...tetrimino.states[stateToCheck][row].length]
        return false if newGridX < 0 or newGridX >= @noColumnsTetris
        return false if newGridY < 0 or newGridY >= @noRowsTetris
        if @grid[newGridY][newGridX + col] isnt 0 and
           tetrimino.states[stateToCheck][row][col] isnt 0
          return false
      newGridY++

    return true

  tick: ->
    if @shouldTick
      @updateGrid()
      if @isGameOver
        @drawGameOver()
      else
        requestAnimationFrame(@tick.bind(this))
    else
      requestAnimationFrame(@tick.bind(this))

  drawGameOver: ->
    @clearCanvases()
    @drawGridLines()
    @clearShadowGrid()

    @tetrisContext.font = '185px gameOver'
    @tetrisContext.fillText('GAME', @boxSize, 7 * @boxSize)
    @tetrisContext.fillText('OVER', @boxSize, 11 * @boxSize)

  clearCanvases: ->
    @tetrisContext.clearRect(0, 0, @tetrisCanvas.width, @tetrisCanvas.height)
    @nextContext.clearRect(0, 0, @nextCanvas.width, @nextCanvas.height)
    @holdContext.clearRect(0, 0, @holdCanvas.width, @holdCanvas.height)

  updateGrid: ->
    @currentTime = new Date().getTime()

    if (@currentTime - @previousTime) > @refreshInterval
      if @checkNextMove(@currentTetrimino.gridX, @currentTetrimino.gridY + 1, @currentTetrimino.currentState, @currentTetrimino)
        @currentTetrimino.gridY++
      else
        @addToGrid(@currentTetrimino)
        @currentTetrimino = @getNextTetrimino()
        @computeShadow(@currentTetrimino)
        @changeRefreshInterval(500)
      @previousTime = @currentTime

    @tetrisContext.clearRect(0, 0, @tetrisCanvas.width, @tetrisCanvas.height)
    @nextContext.clearRect(0, 0, @nextCanvas.width, @nextCanvas.height)
    @holdContext.clearRect(0, 0, @holdCanvas.width, @holdCanvas.height)

    @drawGridLines()
    @drawBoard()
    @drawTetrimino(@currentTetrimino)

    @drawNextGrid()
    @drawHoldGrid()

  cycleState: (tetrimino) ->
    currentState = tetrimino.currentState

    if currentState is tetrimino.states.length - 1
      newState = 0
    else
      newState = currentState + 1

    if @checkNextMove(tetrimino.gridX, tetrimino.gridY, newState, tetrimino)
      return newState
    return currentState

  holdCurrentTetrimino: () ->
    switchTetrimino = @currentTetrimino
    if @isHoldEmpty
      @currentTetrimino = @getNextTetrimino()
    else
      @currentTetrimino = @holdTetrimino
      @currentTetrimino.gridY = 0

    @addToHoldGrid(switchTetrimino)

  changeRefreshInterval: (refreshIntervalValue) ->
    @refreshInterval = refreshIntervalValue

  addToShadowGrid: (tetrimino, newGridY) ->
    @clearShadowGrid()
    tetriminoX = tetrimino.gridX
    tetriminoY = newGridY

    tetriminoState = tetrimino.currentState

    for row, indexRow in tetrimino.states[tetriminoState]
      for col, indexCol in tetrimino.states[tetriminoState][indexRow]
        if tetrimino.states[tetriminoState][indexRow][indexCol] is 1 and
        tetriminoY >= 0
          @shadowGrid[tetriminoY + indexRow][tetriminoX + indexCol] = 1

  clearShadowGrid: ->
    for row, indexRow in @shadowGrid
      for col, indexCol in @shadowGrid[indexRow]
        @shadowGrid[indexRow][indexCol] = 0

  computeShadow: (tetrimino)->
    @shadowGridY = 1

    while (@shadowGridY < @noRowsTetris) and @checkNextMove(tetrimino.gridX, @shadowGridY, tetrimino.currentState, tetrimino)
        @shadowGridY++

    @addToShadowGrid(tetrimino, @shadowGridY - 1)

  keyboardInput: ->
    keyCodes = {
      ESC: 27
      SPACE: 32
      LEFT: 37
      UP: 38
      RIGHT: 39
      DOWN: 40
      CKEY: 67
    }

    if event.keyCode in Helpers.objectValues(keyCodes)
      event.preventDefault()

    switch event.keyCode
      when keyCodes.LEFT
        if @checkNextMove(@currentTetrimino.gridX - 1,
                          @currentTetrimino.gridY,
                          @currentTetrimino.currentState,
                          @currentTetrimino)
          @currentTetrimino.gridX--
          @computeShadow(@currentTetrimino)
      when keyCodes.RIGHT
        if @checkNextMove(@currentTetrimino.gridX + 1,
                          @currentTetrimino.gridY,
                          @currentTetrimino.currentState,
                          @currentTetrimino)
          @currentTetrimino.gridX++
          @computeShadow(@currentTetrimino)
      when keyCodes.DOWN
        if @checkNextMove(@currentTetrimino.gridX,
                          @currentTetrimino.gridY + 2,
                          @currentTetrimino.currentState,
                          @currentTetrimino)
          @currentTetrimino.gridY += 2
      when keyCodes.UP
        @currentTetrimino.currentState = @cycleState(@currentTetrimino)
        @computeShadow(@currentTetrimino)
      when keyCodes.CKEY
        @holdCurrentTetrimino()
        @computeShadow(@currentTetrimino)
      when keyCodes.SPACE
        @currentTetrimino.gridY = (@shadowGridY - 1)
      when keyCodes.ESC
        @shouldTick = !@shouldTick
