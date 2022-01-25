const template = document.createElement('template')
template.innerHTML = `

    <style>
    .emoji-container{
        width: 140px;
    }
    .emoji{
        width:15px;
        height:15px;
    }

    .hidden{
        display: none;
    }
    </style>

    
        <div class="emoji-container hidden">
        </div>
    
`

/**
 *
 */
class Emoji {
  /**
   * Constructor function of a class that is responsible for taking care of making emoji.
   */
  constructor () {
    this.emoji = null
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('emoji-wrapper')
    this.wrapper.classList.add('hidden')
  }

  /**
   * This function creat the emojies and addEventListner to them and add the to DOM.
   *
   * @param {HTMLTextAreaElement} textarea Messages are written here.
   * @returns {HTMLDivElement} Wrapper div that holds all the emojies.
   */
  prepareEmojies (textarea) {
    let lastThreeDigits = 600
    for (let i = 0; i < 36; i++) {
      const emojiSpan = document.createElement('span')
      emojiSpan.classList.add('emoji')
      emojiSpan.innerHTML = `&#x1F${lastThreeDigits++}`
      emojiSpan.addEventListener('click', (event) => {
        textarea.value += event.target.textContent
      })
      this.wrapper.appendChild(emojiSpan)
    }
    return this.wrapper
  }

  /**
   * This function adds emojies to the textarea.
   *
   * @param {HTMLTextAreaElement} textarea Messages are written here.
   */
  getEmoji = (textarea) => {
    textarea.innerHTML += this.emoji
  }

  /**
   * _This function make a smiley emoji and make it clikcable which is responsible for showing and hiding the emoji holder.
   *
   * @param {HTMLDivElement} emojiContainer the wrapper of all emojies.
   * @returns {HTMLSpanElement} The span that holds the smiley emoji.
   */
  smileyEmoji = (emojiContainer) => {
    const smileyEmojiSpan = document.createElement('span')
    smileyEmojiSpan.classList.add('smileyEmoji')
    smileyEmojiSpan.innerHTML = '&#x1F600'
    smileyEmojiSpan.addEventListener('click', () => {
      emojiContainer.classList.toggle('hidden')
    })
    return smileyEmojiSpan
  }
}

export default Emoji
