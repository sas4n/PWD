import './CustomWindow'
const imagesId = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7]
const template = document.createElement('template')
template.innerHTML = `
<style>
  .memory-game-container{
    position: relative;
    height: 375px;
    width: 400px;
    margin: 0;
  }

  .task-bar{
    width:100%;
    height: 20px;
    background-color: lightgray;
    padding:0;
  }

  .drop-down-btn,
  .instruction-btn {
    background-color: lightgray;
    font-size: 8px;
    width: 70px;
    height: 20px;
    border: none;
    padding: 0;
  }

  .drop-down-menu{
    position: absolute;
    top: 20px;
    right: 0;
    height: 45px;
    width: 70px;
  }

  .drop-down-btn{
    position: absolute;
    top: 0;
    right: 0;
  }

  .instruction-btn{
    position: absolute;
    top: 0;
    right: 70px;
  }

  .drop-down-btn:hover,
  .instruction-btn:hover{
    background-color: grey;
  }

  .instruction{
    overflow: auto;
    width: 100px;
    background-color: lightgrey;
    position: absolute;
    top: 20px;
    right: 40px;
    border-radius: 4px;
  }

  .instruction-text{
    font-size:8px;
    overflow: auto;
  }

  .option{
    background-color: lightgrey;
    margin:0;
    text-align: center;
    height: 15px;
    font-size: 8px;
  }

  .option:hover{
    background-color: darkgrey;
  }

  .gameSize2x2,
  .gameSize2x4{
    display: grid;
    grid-template-columns: repeat(2, 60px);
  }

  .gameSize4x4{
    display: grid;
    grid-template-columns: repeat(4, 60px);
  }

  .timer{
    position: absolute;
    top: 80px;
    left: 330px;
  }

  .start-btn{
    width: 80px;
    position: absolute;
    left :290px;
    top: 300px;
    background-color: blue;
    color: white;
    border-radius: 4px;
  }

  .result{
    position: absolute;
    bottom: 10px;
    left: 10px;
    margin:auto;
  }
  .card{
    margin: 5px;
    border-radius: 3px;
    height: 50px;
    width: 50px;
  }

  .card:hover{
    height: 60px;
    width: 60px;
  }
  
  img{
    max-width: 100%;
    max-height: 100%;
  }

  .hidden{
    display: none;
  }
</style

<!--the first div that contains everythings will be the shadowroot itself(somehow) and could not be seen in the dev tools-->
<!-- it can not be accessed by calling it class name so if I want to add style or have access to it I have to made another div inside it wrapping everything-->
<div class="memory-game-shadow-root">
  <div class="memory-game-container">
    <div class="task-bar">
      <div class="drop-down-div">
        <button type="button" class="drop-down-btn">Game Size</button>
        <div class="drop-down-menu hidden">
          <div tabindex="0" class="option" id="size4x4">4x4</div>
          <div tabindex="0" class="option" id="size2x4">2x4</div>
          <div tabindex="0" class="option" id="size2x2">2x2</div>
        </div>
      </div>
      <div class="instruction-div">
        <button type="button" class="instruction-btn">instruction</button>
        <div class="instruction hidden">
          <p class="instruction-text">
            1- To play the game, the user should choose the size of the game(number of rows and columns).<br>
            2- After choosing the size, press the start button to start the timer.<br>
            3- To restart the game, the user could choose another size from size menu.<br>
            4- This game could be played by keyboard only ('tab' for navigating and 'space' for action).
          </p>
        </div>
      </div>
    </div>
    <button type="button" class="start-btn">Start</button>
    <div class="timer"></div>
    <div class="game-section"></div>
    <div class="result"></div>
  </div>
</div>
`
/**
 *
 */
class MemoryGameElement extends window.HTMLElement {
  /**
   * In the Constructor The different elements prepared to be used in the other functions.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.timer = this.shadowRoot.querySelector('.timer')
    this.dropDownBtn = this.shadowRoot.querySelector('.drop-down-btn')
    this.dropDownMenu = this.shadowRoot.querySelector('.drop-down-menu')
    this.gameSize4x4 = this.shadowRoot.querySelector('#size4x4')
    this.gameSize2x4 = this.shadowRoot.querySelector('#size2x4')
    this.gameSize2x2 = this.shadowRoot.querySelector('#size2x2')
    this.sizeOptions = this.shadowRoot.querySelectorAll('.option')
    this.gameSection = this.shadowRoot.querySelector('.game-section')
    this.result = this.shadowRoot.querySelector('.result')
    this.instructionButton = this.shadowRoot.querySelector('.instruction-btn')
    this.instruction = this.shadowRoot.querySelector('.instruction')
    this.statrButton = this.shadowRoot.querySelector('.start-btn')
    this.statrButton.disabled = true

    this.imagesIdArray = []
  }

  /**
   * This function is called when this custom tagged inserted into DOM.
   *
   * @description
   */
  connectedCallback () {
    this.dropDownBtn.addEventListener('click', () => {
      this.dropDownMenu.classList.toggle('hidden')
    })
    this.instructionButton.addEventListener('click', () => {
      this.instruction.classList.toggle('hidden')
    })

    // for disappearing the drop menu if use clicks on anywhere in the memory-game
    this.shadowRoot.querySelector('.memory-game-container').addEventListener('click', (e) => {
      if (e.target !== this.dropDownBtn) {
        this.dropDownMenu.classList.add('hidden')
      }
      if (e.target !== this.instructionButton) {
        this.instruction.classList.add('hidden')
      }
    })
    for (let i = 0; i < this.sizeOptions.length; i++) {
      this.sizeOptions[i].addEventListener('click', this.gameSizeHandler.bind(this))
      this.sizeOptions[i].addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
          this.boundGameSizeHandler = this.gameSizeHandler.bind(this)
          this.boundGameSizeHandler(event)
        }
      })
    }
    this.statrButton.addEventListener('click', this.startTimer.bind(this))
  }

  /**
   *This function reset all values when the game size changes.
   *
   * @description
   */
  initiallizeValues () {
    this.firstCard = null
    this.secondCard = null
    this.attempts = 0
    this.correctGuess = 0
    this.userWon = false
    this.timeUp = false
    this.gameStarted = false
    this.result.innerHTML = ''
    this.statrButton.disabled = false
    this.gameSection.innerHTML = ''
  }

  /**
   * This function creat cards for the game.
   */
  createCards () {
    this.imagesIdArray.sort(() => 0.5 - (Math.random()))
    for (let i = 0; i < this.imagesIdArray.length; i++) {
      const card = document.createElement('div')
      card.classList.add('card')
      const cardImage = document.createElement('img')
      cardImage.addEventListener('click', this.cardTurn.bind(this))
      // evenlistner change the scop of 'this' to the target of eventlistner so we have to bind it to 'this' of the class
      cardImage.addEventListener('keydown', (e) => {
        console.log(e)
        if (e.code === 'Space') {
          this.boundCardTurn = this.cardTurn.bind(this)
          this.boundCardTurn(e)
        }
      })
      cardImage.setAttribute('src', '/image/back-face.jpg')
      cardImage.setAttribute('data-id', this.imagesIdArray[i])
      cardImage.setAttribute('tabindex', '0')
      card.appendChild(cardImage)
      this.shadowRoot.querySelector('.game-section').appendChild(card)
    }
  }

  /**
   * This function starts the timer when startButton clicked and becomes disabled when user playing untill the game size changes.
   *
   */
  startTimer () {
    let startTime = 15
    this.gameStarted = true

    const resultMessage = document.createElement('p')
    const numberOfAttemptsElement = document.createElement('p')
    const countDown = setInterval(() => {
      this.timer.textContent = startTime
      if (startTime > 0 && this.userWon) {
        resultMessage.textContent = 'You won'
        clearInterval(countDown)
        numberOfAttemptsElement.textContent = `Number of attempts :  ${this.attempts}`
      } else if (startTime <= 0 && !this.userWon) {
        this.timeUp = true
        clearInterval(countDown)
        resultMessage.textContent = 'Time is up!!!! You lost'
      } else if (!this.gameStarted) {
        clearInterval(countDown)
      } else {
        startTime--
      }
    }, 1000)
    this.statrButton.disabled = true
    this.result.appendChild(resultMessage)
    this.result.appendChild(numberOfAttemptsElement)
  }

  /**
   * This function Handles all the game sizes when relevant option is chosen from drop diwn menu in the game.
   *
   * @param {event} event which is either keyboard 'keydown' or mouse 'click'.
   */
  gameSizeHandler (event) {
    this.initiallizeValues()
    if (event.target.id === 'size4x4') {
      this.imagesIdArray = imagesId.slice(0, 16)
      this.gameSection.classList.add('gameSize4x4')
    } else if (event.target.id === 'size2x4') {
      this.imagesIdArray = imagesId.slice(0, 8)
      this.gameSection.classList.add('gameSize2x4')
    } else if (event.target.id === 'size2x2') {
      console.log(imagesId.slice(0, 4))
      this.imagesIdArray = imagesId.slice(0, 4)
      this.gameSection.classList.add('gameSize2x2')
    }
    this.createCards()
  }

  /**
   * This function turn the cards to be checked for a match.
   *
   * @param {event} event which could be keyboard 'keydown' or mouse 'click'.
   */
  cardTurn (event) {
    if (this.gameStarted && !this.timeUp) { // To not allow the card to be clicked before pressing the start button or when time is up.
      if (this.firstCard !== null && this.secondCard !== null) {
        return
      }
      if (event.target === this.firstCard) {
        return
      }
      const cardIndex = event.target.getAttribute('data-id')
      if (this.firstCard === null) {
        this.firstCard = event.target
        this.firstCard.classList.add('flip')
        this.firstCard.setAttribute('src', `/image/${cardIndex}.jpg`)
      } else {
        this.attempts++
        this.secondCard = event.target
        this.secondCard.classList.add('flip')
        this.secondCard.setAttribute('src', `/image/${cardIndex}.jpg`)
        setTimeout(this.checkForMatch.bind(this), 1000)
      }
    }
  }

  /**
   * In this function cards will checked for matching then, euther be disabled in case of matching or turn back.
   */
  checkForMatch () {
    if (this.firstCard.getAttribute('data-id') === this.secondCard.getAttribute('data-id')) {
      console.log('hey it s a match')
      this.correctGuess++
      this.disableCards()
    } else {
      const flippedCards = Array.from(document.querySelectorAll('.flip'))
      flippedCards.forEach(element => {
        element.classList.remove('flip')
      })
      this.turnBackCards()
      this.resetCards()
      try {
        console.log(this.firstCard)
        console.log(this.secondCard)
      } catch (error) {
        console.log(error)
      }
      console.log('not lucky')
    }
    this.checkForWin()
  }

  /**
   * If cards are not matched, This function will turn them back.
   */
  turnBackCards () {
    this.firstCard.setAttribute('src', '/image/back-face.jpg')
    this.secondCard.setAttribute('src', '/image/back-face.jpg')
  }

  /**
   * This function disables Card if they are matched.
   */
  disableCards () {
    console.log('disable')
    this.firstCard.removeEventListener('click', this.cardTurn)
    this.secondCard.removeEventListener('click', this.cardTurn)
    this.resetCards()
  }

  /**
   * This function resets the data of the cards and prepare them for the next click.
   */
  resetCards () {
    [this.firstCard, this.secondCard] = [null, null]
  }

  /**
   * This function check if user wins.
   */
  checkForWin () {
    if (this.correctGuess === this.imagesIdArray.length / 2) {
      this.userWon = true
      console.log('it should be a win')
      /* const winMessageElement = document.createElement('p')
      const winMessage = document.createTextNode('You won')
      winMessageElement.appendChild(winMessage)
      const numberOfthis.AttemptsElement = document.createElement('p')
      const numberOfthis.Attempts = document.createTextNode(`Number of this.attempts :  ${this.attempts}`)
      numberOfthis.AttemptsElement.appendChild(numberOfthis.Attempts)
      this.shadowRoot.querySelector('.result').appendChild(winMessageElement)
      this.shadowRoot.querySelector('.result').appendChild(numberOfthis.AttemptsElement) */
      // div.appendChild(result)
    }
  }
}
window.customElements.define('memory-game', MemoryGameElement)

// this.checkForMatch = this.checkForMatch.bind(this)

export default MemoryGameElement
