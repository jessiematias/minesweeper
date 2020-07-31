const grid = document.querySelector('.grid')
const face = document.querySelector('.face')
const flagsLeft = document.querySelector('.flags')
const timerDisplay = document.querySelector('.timer')
let width = 10
let height = 13
let bombAmount = 20
let squares = []
let isGameOver = false
let flags = 0
let timer = false
let seconds = 0
let minutes = 0
let displaySeconds = 0
let displayMinutes = 0
let interval = null

//create Board
function createBoard() {
  flagsLeft.innerHTML = bombAmount - flags
  const bombsArray = Array(bombAmount).fill('bomb')
  const emptyArray = Array(width * height - bombAmount).fill('valid')
  const gameArray = emptyArray.concat(bombsArray)

  //  --Fisher–Yates shuffle algorithm--
  const getRandomValue = (i, N) => Math.floor(Math.random() * (N - i) + i)
  gameArray.forEach((elem, i, arr, j = getRandomValue(i, arr.length)) => [arr[i], arr[j]] = [arr[j], arr[i]])

  // --- create squares ---
  for (let i = 0; i < width * height; i++) {
    const square = document.createElement('div')
    square.setAttribute('id', i)
    square.classList.add(gameArray[i])
    grid.appendChild(square)
    squares.push(square)

    square.addEventListener('click', () => {
      click(square)
    })

    square.oncontextmenu = function (e) {
      e.preventDefault()
      addFlag(square)
    }
  }

  //add numbers
  for (let i = 0; i < squares.length; i++) {
    let total = 0
    const isLeftEdge = (i % width === 0)
    const isRightEdge = (i % width === width - 1)

    if (squares[i].classList.contains('valid')) {
      //left
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
      //top right
      if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
      //top 
      if (i > 10 && squares[i - width].classList.contains('bomb')) total++
      //top left 
      if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
      //right 
      if (i < 129 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
      //bottom left 
      if (i < 120 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
      //bottom right
      if (i < 119 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
      //bottom 
      if (i <= 119 && squares[i + width].classList.contains('bomb')) total++

      squares[i].setAttribute('data', total)
    }
  }
}
createBoard()

//add Flag with right click
function addFlag(square) {
  if (isGameOver) return
  if (!square.classList.contains('checked') && (flags < bombAmount)) {
    if (!square.classList.contains('flag')) {
      square.classList.add('flag')
      square.innerHTML = '⚑'
      flags++
      flagsLeft.innerHTML = bombAmount - flags
      checkForWin()
    } else {
      square.classList.remove('flag')
      square.innerHTML = ''
      flags--
      flagsLeft.innerHTML = bombAmount - flags
    }
  }
}

function click(square) {

  if (!timer) {
    timer = true
    interval = window.setInterval(setTimer, 1000)
  }
  if (isGameOver) return
  if (square.classList.contains('checked')) return
  if (square.classList.contains('bomb')) {
    square.classList.add('red')
    gameOver()
  } else {
    let total = square.getAttribute('data')
    //check if square is near a bomb 
    if (total != 0) {
      square.classList.add('checked')
      if (total == 1) square.classList.add('one')
      if (total == 2) square.classList.add('two')
      if (total == 3) square.classList.add('three')
      if (total == 4) square.classList.add('four')
      if (total == 5) square.classList.add('five')
      square.innerHTML = total
      return
    }
    //if not near a bomb, run checkSquare function to clear out other empty squares nearby
    checkSquare(square, square.id)
  }
  square.classList.add('checked')
}

//display timer 
function setTimer() {

  timer = true
  seconds++
  seconds < 10 ? displaySeconds = "0" + seconds.toString() : displaySeconds = seconds
  minutes < 10 ? displayMinutes = "0" + minutes.toString() : displayMinutes = minutes

  if (seconds / 60 === 1) {
    seconds = 0
    minutes++
  }
  timerDisplay.innerHTML = displayMinutes + ":" + displaySeconds
}

function gameOver() {
  isGameOver = true
  face.innerHTML = '☹'
  window.clearInterval(interval)
  squares.forEach(square => (square.classList.contains('bomb')) ? markBombs(square) : null)
}
// give checked class to all bombs after clicking one bomb
function markBombs(bomb) {
  bomb.innerHTML = '✹'
  bomb.classList.add('checked')
}
//will clear other empty squares nearby if empty square is clicked by using recursion
function checkSquare(sq, currentId) {
  const isLeftEdge = (currentId % width === 0)
  const isRightEdge = (currentId % width === width - 1)

  setTimeout(() => {
    // clear all empty squares to the left
    if (currentId > 0 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1].id
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    //clear all empty squares to the top right
    if (currentId > 9 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 - width].id
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // clear all empty squares to the top 
    if (currentId > 10) {
      const newId = squares[parseInt(currentId - width)].id
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // clear all empty squares to the top left
    if (currentId > 11 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 - width].id
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // clear all empty squares to the right
    if (currentId < 129 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1].id
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // clear all empty squares to the bottom left
    if (currentId < 120 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1 + width].id
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // clear all empty squares to the bottom right
    if (currentId < 119 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 + width].id
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
    // clear all empty squares to the bottom
    if (currentId < 119) {
      const newId = squares[parseInt(currentId) + width].id
      const newSquare = document.getElementById(newId)
      click(newSquare)
    }
  }, 10)
}

//check if won
function checkForWin() {
  let matches = 0
  if (isGameOver) {
    matches = 0
  }
  for (let i = 0; i < squares.length; i++) {
    if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
      matches++
    }
    if (matches === bombAmount) {
      face.innerHTML = '☻'
      isGameOver = true
    }
  }
}

// eslint-disable-next-line no-unused-vars
function resetGame() {
  window.clearInterval(interval)
  timer = false
  seconds = 0
  minutes = 0
  timerDisplay.innerHTML = "00:00" 
  flagsLeft.innerHTML = ""
  face.innerHTML = '☺'
  width = 10
  height = 13
  bombAmount = 20
  squares = []
  isGameOver = false
  flags = 0
  grid.innerHTML = ""
  createBoard()
}  