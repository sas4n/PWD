import './MemoryGameElement'
import './ChatAppElement'
import './CustomWindow'
import './QuizElement'
import './Emoji'

document.addEventListener('DOMContentLoaded', () => {
  let idNumber = 0
  let top = 30
  let left = 30
  const appContainer = document.querySelector('.app-container')
  const memoryGameIcon = document.querySelector('#memory-game-icon')
  const chatAppIcon = document.querySelector('#chat-app-icon')
  const quizAppIcon = document.querySelector('#quiz-app-icon')

  /**
   * This function check the appTagName and add the relevant custom element (of the desired app) to the custom window.
   * Each new custom window moved slightly to right and down.
   *
   * @param {string} appTagName name of the app which supposed to be added to the custom window.
   * @param {customWindow} customWindow custom window which the app will add to.
   */
  const appHandler = (appTagName, customWindow) => {
    idNumber++
    customWindow.setAttribute('name', appTagName)
    customWindow.classList.add(appTagName)
    customWindow.focus()
    customWindow.setAttribute('id', `customNR${idNumber}`)
    customWindow.style.top = `${top}px`
    customWindow.style.left = `${left}px`
    customWindow.style.zIndex = idNumber
    top += 10
    left += 10
    appContainer.appendChild(customWindow)
    customWindow.addEventListener('click', topHoister)
  }

  /**
   * This function make the target of the event focused and hoist it to the top of all opened custom windows.
   *
   * @param {event} event Event could be mouse 'click' or 'drag' events.
   */
  const topHoister = (event) => {
    const id = event.target.getAttribute('id')
    const target = document.getElementById(id)
    event.target.style.zIndex = idNumber
    idNumber++
    target.focus()
  }

  memoryGameIcon.addEventListener('click', function () {
    this.customWindow = document.createElement('custom-window')
    appHandler('memory-game', this.customWindow)
  })

  chatAppIcon.addEventListener('click', function () {
    this.customWindow = document.createElement('custom-window')
    appHandler('chat-app', this.customWindow)
  })

  quizAppIcon.addEventListener('click', function () {
    this.customWindow = document.createElement('custom-window')
    appHandler('quiz-app', this.customWindow)
  })

  document.addEventListener('dragstart', function (event) {
    const style = window.getComputedStyle(event.target, null)
    event.dataTransfer.setData('text/plain',
      (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue('top'), 10) - event.clientY) +
       ',' + event.target.id)
    console.log('in dragstart')
    event.target.style.opacity = 0.5
    topHoister(event)
  })
  document.addEventListener('dragleave', function (e) {
    // document.getElementById(draggedWindowID).setAttribute('draggable', 'false')
  })
  document.addEventListener('dragenter', (event) => {
    console.log('dragentetr')
    console.log(event.target)
    event.preventDefault()
    if (event.target.classList.contains('pwd-body')) {
      console.log('entered')
      document.addEventListener('dragover', (event) => {
        event.preventDefault()
      })
    }
  })
  document.addEventListener('dragend', function (event) {
    event.target.style.opacity = ''
  })
  document.addEventListener('drop', (event) => {
    /* if (event.target.className === 'app-container') {
      event.preventDefault()
      event.target.style.background = ''
      event.target.appendChild(dragged)
    } */
    const offset = event.dataTransfer.getData('text/plain').split(',')
    console.log(offset[2])
    const dm = document.getElementById(offset[2])
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px'
    event.preventDefault()
  })
})
