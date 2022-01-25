const template = document.createElement('template')
template.innerHTML = `
    <style>

:host {
    position:relative;
    width: 390px;
    height: 360px;
}
    .user-name{
        position:absolute;
        left: 40px;
        top: 5px;
        width 200px;
    }

    .answer-container{
        position: absolute;
        width: 300px;
        left: 50px;
        top: 80px;
        overflow: auto;
    }
    
    .user-info,
    .answer {
      border: 0;
      box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
    }
    
    .question-container {
      position: absolute ;
      width: 190px;
      height: 100px;
      margin-top: 5px;
      top: 10px;
      left:50px;
    }

    .response-container {
        padding-left: 5px;
    }
    
    .timer-container {
      position: absolute;
      width: 15px;
      height: 65px;
      top: 10px;
      left: 320px;
    }
    
    
    .message-after-answer {
      position: absolute;
      width: 200px;
      top: 0;
      left: 40px;
    }
    
    .question-btn,
    .answer-btn {
      background-color: rgb(106, 134, 228);
      color: white;
      border-radius: 3px;
      min-width: 60px;
      margin: 5px;
      max-height: 20px;
    }
    
    .question-btn {
      position: absolute;
      bottom: 0;
      left: 45px;
    }
    
    .reset {
      background-color: rgb(212, 58, 58);
      color: white;
      border-radius: 3px;
      width: 60px;
    }
    
    .highscore-container{
        position: absolute;
        top: 40px;
        left: 170px;
        width: 120px;
    }
    
    table,
    th,
    td {
      border: 1px solid;
    }
    
    footer a {
      position: absolute;
      bottom: 10px;
      left: 10px;
      text-decoration: none;
    }
    
    .hidden {
      display: none;
    }

    .game-message{
        position: absolute;
        top: 320px;
        left: 30px;
        width: 280px
    }
    </style>

        

        <div class="question-container">
            <button type="button" class="question-btn" disabled="disabled">Start</button>
            <p class="question-text hidden"></p>
        </div>

        <div class="user-info">
            <input type="text" name="user-name" class="user-name" placeholder="Enter a nickname" >
        </div>

        <div class="timer-container">
            <p class="timer hidden"></p>
        </div>

        <div class="answer-container">
            <div class="text-answer">
                <input type="text" class="answer hidden" placeholder="write your answer here"  required />
            </div>

            <div class="multiple-answer hidden">
                <input type="radio" class="hidden" id="alt1" name="radio-btn" value="alt1">
                <label for="alt1" class="hidden" name="radio-btn-label"></label><br>
                <input type="radio" class="hidden" id="alt2" name="radio-btn" value="alt2">
                <label for="alt2" class="hidden" name="radio-btn-label"></label><br>
                <input type="radio" class="hidden" id="alt3" name="radio-btn" value="alt3">
                <label for="alt3" class="hidden" name="radio-btn-label"></label><br>
                <input type="radio" class="hidden" id="alt4" name="radio-btn" value="alt4">
                <label for="alt4" class="hidden" name="radio-btn-label"></label>
            </div>

            <button type="button" class="answer-btn hidden" disabled= "disabled">Submit</button>
            <button type="button" class="reset hidden"> Restart </button>
        </div>

        <div class="highscore-container hidden">
            <p>High score of the first five users</p>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Username</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="results-container">
            <p class="message-after-answer"></p>
            <p class="game-message"></p>
        </div>
`
/**
 *
 */
class QuizElement extends window.HTMLElement {
  /**
   * Constructor function that prepare the custom element.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.template = template.content.cloneNode(true)
    this.shadowRoot.appendChild(this.template)
  }

  /**
   *This funcion is called when custom element is added to the DOM.
   */
  connectedCallback () {
    this.intiallize()
  }

  /**
   *This function is required for resethandler, so each time the app restarts, all elements and handlers should be decleared again.
   */
  intiallize () {
    this.nicknameTextField = this.shadowRoot.querySelector('.user-name')
    this.questionButton = this.shadowRoot.querySelector('.question-btn')
    this.timer = this.shadowRoot.querySelector('.timer')
    this.gameMessage = this.shadowRoot.querySelector('.game-message')
    this.messageAfterAnswer = this.shadowRoot.querySelector('.message-after-answer')
    this.instruction = this.shadowRoot.querySelector('.instruction')
    this.questionText = this.shadowRoot.querySelector('.question-text')
    this.answerButton = this.shadowRoot.querySelector('.answer-btn')
    this.answerTextField = this.shadowRoot.querySelector('.answer')
    this.resetButton = this.shadowRoot.querySelector('.reset')
    this.radioButtonsContainer = this.shadowRoot.querySelector('.multiple-answer')
    this.radioButtons = this.shadowRoot.querySelectorAll('[name = "radio-btn"]')
    this.radioButtonLabels = this.shadowRoot.querySelectorAll('[name = "radio-btn-label"]')
    this.tableBody = this.shadowRoot.querySelector('tbody')
    this.tableDataRows = this.tableBody.querySelectorAll('tr')
    this.highscoreContainer = this.shadowRoot.querySelector('.highscore-container')
    this.nicknameTextField.addEventListener('input', () => {
      this.boundTextFieldHandler = this.textFieldHandler.bind(this)
      this.boundTextFieldHandler(this.nicknameTextField, this.questionButton)
    })

    this.questionButton.addEventListener('click', this.questionButtonHandler.bind(this))

    this.answerTextField.addEventListener('input', () => this.textFieldHandler(this.answerTextField, this.answerButton))

    this.answerButton.addEventListener('click', this.answerButtonHandler.bind(this))

    this.resetButton.addEventListener('click', this.resetButtonHandler.bind(this))
  }

  /**
   * This function disable the button if the relevant textfield is empty.
   *
   * @description
   * @param {Element} textfeild This could be either textfield for nickname or for answer.
   * @param {Element} button This could be either start button or submit button.
   */
  textFieldHandler (textfeild, button) {
    if (textfeild.value === '') {
      button.disabled = true
    } else {
      button.disabled = false
      if (textfeild === this.nicknameTextField) {
        nickname = textfeild.value
      } else if (textfeild === this.answerTextField) {
        answer = textfeild.value
      }
    }
  }

  /**
   * This function handles The question button click.
   */
  async questionButtonHandler () {
    this.startTimer()
    this.questionButton.textContent = 'Next Question'
    hideElements(this.questionButton, this.messageAfterAnswer, this.nicknameTextField)

    const response = await getResponse(url)
    const data = await response.json()
    const question = data.question
    this.questionText.textContent = question
    showElements(this.questionText, this.answerButton)
    this.showCorrectFormOfQuestion(data)
    url = data.nextURL
  }

  /**
   * This function handles the answer button click.
   */
  async answerButtonHandler () {
    answerButtonClicked = true
    hideElements(this.timer)
    const answer = this.userAnswerHandler()
    const body = {
      answer: answer
    }
    try {
      const response = await sendAnswer(url, body)
      const data = await response.json()
      this.messageAfterAnswer.textContent = data.message
      showElements(this.questionButton, this.messageAfterAnswer)
      hideElements(...this.radioButtons, ...this.radioButtonLabels, this.radioButtonsContainer, this.answerButton, this.questionText)
      if (data.nextURL === undefined) {
        console.log(this)
        this.userWon()
      }
      url = data.nextURL
    } catch (error) {
      this.errorHandler(error)
    }
    this.answerTextField.value = ''
    this.answerButton.disabled = true
  }

  /**
   * This function handles the reset button click.
   */
  resetButtonHandler () {
    nickname = null
    answer = null
    answerButtonClicked = false
    userTime = 0
    isMultipleChoice = false
    url = 'https://courselab.lnu.se/quiz/question/1'
    this.shadowRoot.innerHTML = ''
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.intiallize()
  }

  /**
   * This function uses for starting and resetting the timer and since it is asynchronous, try and catching the error
   * should happen inside the setInterval.
   * the reason for answerButtonClicked is to check if answer submitted before 10 seconds.
   *
   * @description
   * @param {Error} error The error would be GameOverError, only to check if user is out of time.
   */
  startTimer (error) {
    showElements(this.timer)
    answerButtonClicked = false
    let startTime = 9
    const countDown = setInterval(() => {
      this.timer.textContent = startTime
      if (startTime <= 0 && !answerButtonClicked) { // If timer reach to zero while user did not submit the answer.
        try {
          clearInterval(countDown)
          throw new GameOverError('Your time is up!. Try to be faster next time.')
        } catch (error) {
          this.errorHandler(error)
        }
      } else if (startTime > 0 && answerButtonClicked) { // If submit button clicked before timer shows 0.
        clearInterval(countDown)
      } else if ((!error) instanceof GameOverError) {
        clearInterval(countDown)
      } else {
        userTime++
        startTime--
      }
    }, 1000)
  }

  /**
   * This function takes error object as input and handle the error.
   *
   * @description
   * @param {Error} error The error input is an object which its message will be shown on the page.
   */
  errorHandler (error) {
    this.gameMessage.textContent = error.message
    showElements(this.resetButton)
    this.answerButton.disabled = true
  }

  /**
   * This function show choose between two type of question. 1-Textfield 2- Multiple-choice.
   *
   * @description
   * @param {Promise} data This is a promise which later could be check if it has alternative object or not.
   */
  async showCorrectFormOfQuestion (data) {
    if (data.alternatives === undefined) {
      isMultipleChoice = false
      showElements(this.answerTextField)
      this.answerTextField.focus()
    } else {
      this.radioButtonsContainer.classList.remove('hidden')
      isMultipleChoice = true
      for (let i = 0; i < Object.keys(data.alternatives).length; i++) {
        showElements(this.radioButtons[i], this.radioButtonLabels[i])
        this.radioButtons[i].checked = false
        this.radioButtons[i].addEventListener('input', () => {
          this.textFieldHandler(this.radioButtons[i], this.answerButton)
        })
        this.radioButtonLabels[i].textContent = data.alternatives[`alt${i + 1}`]
      }
    }
  }

  /**
   * This function is for taking care of everything happens after user successfully finish the quiz.
   *
   *@description
   */
  userWon () {
    saveUserInfo()
    hideElements(this.questionButton)
    console.log(nickname)
    console.log(userTime)
    this.gameMessage.textContent = `Wow ${nickname} you won!! You finished the quiz in ${userTime} seconds, that is amazing`
    showElements(this.resetButton)
    console.log('everything works before showhighscore')
    this.showHighScore()
  }

  /**
   * These are what happens in this function:
   * -Iterate through all localStorage objects and create a new object using its key and value.
   * -Put all objects in an array.
   * -Sort the array so later users with lower time would be first in the array.
   * -finally shows all data in form of a table where basically is our highscore table.
   *
   *@description
   */
  showHighScore () {
    let numberOfhighscoresRow
    const dataArray = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const obj = {
        key: key,
        value: localStorage.getItem(key)
      }
      dataArray.push(obj)
    }
    dataArray.sort(compare)
    // this will check for the lenght of local storage, because we only have 5 rows and if localstorage length is more than 5 it will cause an error since we dont have enough number of rows
    // so this.tableDataRows[i] after 5 rows will be undefined.
    if (localStorage.length > 5) {
      numberOfhighscoresRow = 5
    } else {
      numberOfhighscoresRow = localStorage.length
    }
    for (let i = 0; i < numberOfhighscoresRow; i++) {
      if (dataArray[i].key !== 'username-for-chat-app') {
        const tableData = this.tableDataRows[i].querySelectorAll('td')
        tableData[0].textContent = i + 1
        tableData[1].textContent = dataArray[i].key
        tableData[2].textContent = dataArray[i].value
      }
    }
    showElements(this.highscoreContainer)
  }

  /**
   * This function handles the answer from multiplechoice or textfield.
   *
   * @description
   *@returns {string} answer
   */
  userAnswerHandler () {
    if (isMultipleChoice) {
      for (let i = 0; i < this.radioButtons.length; i++) {
        if (this.radioButtons[i].checked) {
          this.answerButton.disabled = false
          answer = this.radioButtons[i].value
        }
      }
    } else {
      this.answerTextField.classList.add('hidden')
    }
    return answer
  }
}
window.customElements.define('quiz-app', QuizElement)

let nickname
let answer
let answerButtonClicked = false
let userTime = 0
let isMultipleChoice = false
let url = 'https://courselab.lnu.se/quiz/question/1'
/**
 * This function take the url and fetch the data using it.
 *
 *@description
 * @param {string} url the url is a string that use for fetching data.
 * @returns {Promise} response
 */
const getResponse = async (url) => {
  const response = await fetch(url)
  return response
}

/**
 * This function send the data to the specified url and receive the response.
 *
 * @description
 * @param {string} url This string provide the url that data need to be send to.
 * @param {string} body This is the answer provided by user.
 * @returns {Promise} response
 */
const sendAnswer = async (url, body) => {
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const response = await fetch(url, data)
  if (response.status !== 200) {
    if (response.status !== 400) {
      throw new Error(`The error status is ${response.status}`)
    } else {
      const data = await response.json()
      throw new GameOverError(`${data.message}. You lost`)
    }
  }
  return response
}

/**
 * This function save the user information in localStorage.
 *
 * @description
 */
const saveUserInfo = () => {
  console.log('nickname in saveuser is ' + nickname)
  const localStorageValue = localStorage.getItem(nickname)
  console.log(localStorage)
  if (localStorageValue == null || userTime < localStorageValue) {
    localStorage.setItem(nickname, JSON.stringify(userTime))
  }
}
/**
 *
 */
class GameOverError extends Error {
  /**
   * The constructor only takes a single argument which is a message and pass it to super class
   * to use for handeling error.
   *
   * @description
   * @param {string} message This is a string to show the message of the error if required.
   */
  constructor (message) {
    super(message)
    this.name = 'GameOverError'
  }
}

/**
 * This function is a dynamic way to hide elements. It can handle 1 or more elements. It can avoid repeating element.classList.add('hidden').
 *
 *@description
 */
function hideElements () {
  Array.from(arguments).forEach(element => {
    element.classList.add('hidden')
  })
}

/**
 *This function is a dynamic way to show elements. It can handle 1 or more elements. It can avoid repeating element.classList.remove('hidden').
 *
 @description
 */
function showElements () {
  Array.from(arguments).forEach(element => {
    element.classList.remove('hidden')
  })
}

/**
 * This is a helper function which is the logic for sorting the array. More information
 * could be find in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort.
 *
 * @description
 * @param {object} firstObject This is the first object which is basically user's nickname and time.
 * @param {object} secondObject This is the second object which is basically user's nickname and time.
 * @returns {number} The return value is the difference between time of first object and second object.
 */
function compare (firstObject, secondObject) {
  return firstObject.value - secondObject.value
} // response

export default QuizElement
