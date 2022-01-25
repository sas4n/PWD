import './CustomWindow'
import Emoji from './Emoji'
const template = document.createElement('template')
template.innerHTML = `
  <style>
  .chat-app-wrapper {
    position: relative;
    height: 350px;
    width: 350px;
  }
  .receivedMessage {
    position: absolute;
    height: 250px;
    width: 370px;
    top: 35px;
    left:8px;
    overflow: auto;
    border: 1px solid black;
    padding: 5px;
  }
  
  #message-box {
    position : absolute;
    width: 200px;
    bottom: 0;
    left: 5px;
  }
  .sendbtn{
    position: absolute;
    width: 60px;
    bottom : 0;
    right : 70px;
    background-color: blue;
    border-radius: 4px;
    color: white;
  }

  .emoji-wrapper{
    width: 140px;
    border: 1px solid black;
    border-radius: 4px;
    background-color: grey;
    position: absolute;
    right: 2px;
    bottom: 50px;
}

  .smileyEmoji{
    position: absolute;
    right: 30px;
    bottom: 30px;
  }

  .hidden {
    display: none;
  }

  </style>

  <div class="chat-app-wrapper">
    <input type="text" class="username" placeholder="Enter Username">
    <button type="button" class="save-btn">Save</button>
    <div class="receivedMessage"></div>
    <textarea id="message-box"></textarea>
    <button type="button" class="sendbtn">send</button>
  </div>
`
/**
 *
 */
class ChatAppElement extends window.HTMLElement {
  /**
   *Constructor function where all elements prepared.
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    this.receviedMessageDiv = this.shadowRoot.querySelector('.receivedMessage')
    this.sendBtn = this.shadowRoot.querySelector('.sendbtn')
    this.messageArea = this.shadowRoot.querySelector('#message-box')
    this.emoji = new Emoji()
    this.url = 'wss://courselab.lnu.se/message-app/socket'
    this.emojiHolder = this.emoji.prepareEmojies(this.messageArea)
    this.userNameTextfield = this.shadowRoot.querySelector('.username')
    this.savebtn = this.shadowRoot.querySelector('.save-btn')
    this.shadowRoot.appendChild(this.emojiHolder)
    this.shadowRoot.appendChild(this.emoji.smileyEmoji(this.emojiHolder))
  }

  /**
   * This function is called when relevant tag added to DOM. Mostly all functionality happens in this function like, opening the web socket,
   * Sending and receiving the message.
   */
  connectedCallback () {
    const sendData = {
      type: 'message',
      data: '',
      username: '',
      channel: 'something',
      key: this.key
    }

    checkForUsername(this.userNameTextfield, this.savebtn)
    this.savebtn.addEventListener('click', () => {
      saveUserInfo(this.userNameTextfield, this.savebtn)
    })
    this.ws = new WebSocket(this.url)

    this.ws.addEventListener('open', () => {
      console.log('connection is open')
    })

    this.ws.addEventListener('message', (receivedEvent) => {
      const receivedObject = JSON.parse(receivedEvent.data)
      if (receivedObject.type !== 'heartbeat') {
        const userP = document.createElement('p')
        userP.classList.add('userName')
        userP.textContent = `${receivedObject.username} said: `
        const messageP = document.createElement('p')
        messageP.classList.add('message')
        messageP.textContent = receivedObject.data
        this.receviedMessageDiv.appendChild(userP)
        this.receviedMessageDiv.appendChild(messageP)
      }
    })

    this.sendBtn.addEventListener('click', () => {
      sendData.data = this.messageArea.value
      sendData.username = username
      console.log(sendData)
      if (this.ws.readyState === 1) {
        this.ws.send(JSON.stringify(sendData))
        console.log('message sent successfully')
      }
      this.messageArea.value = ''
    })
  }
}

window.customElements.define('chat-app', ChatAppElement)

let username

/**
 * This function save the user information in localStorage.
 *
 * @param {HTMLInputElement} textField  This is a input text field, where user enter his username.
 * @param {button} button This is a button that save username.
 * @description
 */
const saveUserInfo = (textField, button) => {
  username = textField.value
  const localStorageValue = localStorage.getItem('username-for-chat-app')
  console.log(localStorage)
  if (localStorageValue == null) {
    localStorage.setItem('username-for-chat-app', username)
    textField.classList.add('hidden')
    button.classList.add('hidden')
  }
}

/**
 * When chatApp opened, this function checks if username entered his/her username previously, if not, ask user to do it and save it.
 * If user already entered the username, the textfield and button would be hidden.
 *
 * @param {HTMLInputElement} textField This is a input text field, where user enter his username.
 * @param {button} button This is a button that save username.
 */
const checkForUsername = (textField, button) => {
  username = localStorage.getItem('username-for-chat-app')
  if (username != null) {
    textField.classList.add('hidden')
    button.classList.add('hidden')
  }
}

export default ChatAppElement
