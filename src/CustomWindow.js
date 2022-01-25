// import './MemoryGameElement'
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {   
      display: block;
      height: 400px;
      width: 400px;
      border: 2px solid black;  
      border-radius: 4px;
     background-color: white;
     margin-bottom:60px;
      
        }

        .wrapper {
            
            min-height:100px;
            min-width:100px;
            width: 400px;
            height: 400px;
           /* border-radius: 4px;
            border: 2px solid black;*/
            position: relative;
           /* background-color: white;
            outline: 2px solid black;*/
          }
         .topBar{
            position: absolute;
            top: 0;
            width: 100%;
            height: 25px;
            background-color:blue;
          }
          
          .close{
            cursor: pointer;
            position: absolute;
            text-align: center;
            font-size: 20px;
            top: 0;
            right: 0;
            width: 25px;
            height: 100%;
            background-color: red;
          }

          .mainDiv {
              position : absolute;
              top: 25px;
              height: 375px;
              width: 100%;
              
          }
          
          .close:hover{
            background-color:rgb(156, 7, 7);
          }
          .hidden{
            display: none;
          }
    </style>
        <div class="wrapper">
            <div class="topBar">
                <span class="close">&times</span>
            </div>
            <div class="mainDiv">
            </div>
        </div>
    

`
/**
 *
 */
class CustomWindow extends window.HTMLElement {
  /**
   * Constructor function of a custom window. This is the window where all apps will run on.
   *
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.shadowRoot.querySelector('.close').addEventListener('click', () => {
      this.classList.add('hidden')
    })
  }

  /**
   * The connect callback that called when the tag added to DOM.
   */
  connectedCallback () {
    this.setAttribute('draggable', 'true')
  }

  /**
   * A static method that wiat for any changes on all the values that are in the returned array.
   *
   * @returns {Array} returns an array of attributes that should be obsereved for any changes.
   */
  static get observedAttributes () {
    return ['name']
  }

  /**
   * If any changes happen in the attributes defined in the observedAttributes function, the change value could be captured and used here.
   *
   * @param {string} name the attributed which changed.
   * @param {string} oldValue the old value of the attribute.
   * @param {string} newValue the new value of the attribute.
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'name') {
      if (newValue === 'memory-game') {
        this.shadowRoot.querySelector('.mainDiv').appendChild(document.createElement('memory-game'))
      } else if (newValue === 'chat-app') {
        this.shadowRoot.querySelector('.mainDiv').appendChild(document.createElement('chat-app'))
      } else if (newValue === 'quiz-app') {
        this.shadowRoot.querySelector('.mainDiv').appendChild(document.createElement('quiz-app'))
      }
    }
  }
}
window.customElements.define('custom-window', CustomWindow)

export default CustomWindow
