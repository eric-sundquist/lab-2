import '../interval-timer-setup'
import '../interval-timer-time-display'
import '../interval-timer-controls'
import { IntervalTimer } from '../../IntervalTimer'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host {
      display: block;
    }

    .hidden {
      display: none;
    }
  </style>

  <h1>Interval timer</h1>
  <p>
    This explains a jolly good tick tock interval timer.
  </p>

  <interval-timer-time-display class="hidden"></interval-timer-time-display>
  <interval-timer-controls class="hidden"></interval-timer-controls>
  <interval-timer-setup></interval-timer-setup>

`

customElements.define(
  'interval-timer',
  class extends HTMLElement {
    /**
     * @type {IntervalTimer}
     */
    #intervalTimer
    /**
     * @type {HTMLElement}
     */
    #timeDisplayElement
    /**
     * @type {HTMLElement}
     */
    #controlsElement
    /**
     * @type {HTMLElement}
     */
    #setupElement

    constructor() {
      super()
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#intervalTimer = new IntervalTimer()
      this.#timeDisplayElement = this.shadowRoot.querySelector('interval-timer-time-display')
      this.#controlsElement = this.shadowRoot.querySelector('interval-timer-controls')
      this.#setupElement = this.shadowRoot.querySelector('interval-timer-setup')

      this.#setupEventListerners()
    }

    #setupEventListerners() {
      this.#intervalTimer.addEventListener('updated', (event) => this.#handleTimeUpdate(event))
      this.#intervalTimer.addEventListener('expired', (event) => this.#handleTimeUpdate(event))
      this.#intervalTimer.addEventListener('reseted', (event) => this.#handleTimeUpdate(event))

      this.#setupElement.addEventListener('start-new-interval', (event) => this.#handleStartNew(event))

      this.#controlsElement.addEventListener('start', () => this.#intervalTimer.start())
      this.#controlsElement.addEventListener('pause', () => this.#intervalTimer.pause())
      this.#controlsElement.addEventListener('reset', () => this.#intervalTimer.reset())
    }

    /**
     * @param {Object} timerData
     */
    #startTimer(timerData) {
      this.#setTimer(timerData)

      this.#intervalTimer.startNew()
    }

    #setTimer(timerData) {
      this.#intervalTimer.setWorkTime(timerData.workTime)
      this.#intervalTimer.setRestTime(timerData.restTime)
      this.#intervalTimer.setSets(timerData.sets)
    }

    #handleStartNew(event) {
      this.#toggleControls()
      this.#startTimer(event.detail)
    }

    #handleTimeUpdate(event) {
      const timeString = event.detail.timeString
      const timeDisplayComponent = this.shadowRoot.querySelector('interval-timer-time-display')
      timeDisplayComponent.setAttribute('time', timeString)
    }

    #handleExpire(event) {
      this.#handleTimeUpdate(event)
    }

    #toggleControls() {
      const timeDisplayElement = this.shadowRoot.querySelector('interval-timer-time-display')
      timeDisplayElement.classList.toggle('hidden')

      const controlsElement = this.shadowRoot.querySelector('interval-timer-controls')
      controlsElement.classList.toggle('hidden')

      const setupElement = this.shadowRoot.querySelector('interval-timer-setup')
      setupElement.classList.toggle('hidden')
    }
  }
)