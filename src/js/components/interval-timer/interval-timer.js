import '../interval-timer-setup'
import '../interval-timer-time-display'
import '../interval-timer-controls'
import '../interval-timer-error'
import { IntervalTimer } from '../../IntervalTimer'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
    }

    .hidden {
      display: none;
    }
  </style>
  <interval-timer-error class="hidden"></interval-timer-error>
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
    /**
     * @type {HTMLElement}
     */
    #errorMessageElement

    constructor() {
      super()
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#intervalTimer = new IntervalTimer()
      this.#timeDisplayElement = this.shadowRoot.querySelector('interval-timer-time-display')
      this.#controlsElement = this.shadowRoot.querySelector('interval-timer-controls')
      this.#setupElement = this.shadowRoot.querySelector('interval-timer-setup')
      this.#errorMessageElement = this.shadowRoot.querySelector('interval-timer-error')

      this.#setupEventListerners()
    }

    #setupEventListerners() {
      this.#intervalTimer.addEventListener('updated', (event) => this.#handleTimeUpdate(event))
      this.#intervalTimer.addEventListener('expired', (event) => this.#handleTimeExpired(event))
      this.#intervalTimer.addEventListener('reseted', (event) => this.#handleTimeUpdate(event))

      this.#setupElement.addEventListener('start-new-interval', (event) => this.#handleStartNew(event))

      this.#controlsElement.addEventListener('start', () => this.#intervalTimer.start())
      this.#controlsElement.addEventListener('pause', () => this.#intervalTimer.pause())
      this.#controlsElement.addEventListener('reset', () => this.#intervalTimer.reset())
      this.#controlsElement.addEventListener('exit', () => this.#handleExit())
    }

    #handleExit() {
      this.#intervalTimer.reset()
      this.#updateComponentVisability()
    }

    #setTimer(timerData) {
      this.#intervalTimer.setWorkTime(timerData.workTime)
      this.#intervalTimer.setRestTime(timerData.restTime)
      this.#intervalTimer.setSets(timerData.sets)
    }

    #isErrorMessageHidden() {
      return this.#errorMessageElement.classList.contains('hidden')
    }

    /**
     * @param {Event} event
     */
    #handleStartNew(event) {
      if (!this.#isErrorMessageHidden()) {
        this.#errorMessageElement.classList.add('hidden')
      }

      try {
        this.#startTimer(event.detail)
        this.#updateComponentVisability()
      } catch (error) {
        this.#errorMessageElement.setErrorMessage(error.message)
        this.#errorMessageElement.classList.remove('hidden')
      }
    }

    /**
     * @param {Object} timerData
     */
    #startTimer(timerData) {
      this.#setTimer(timerData)
      this.#intervalTimer.startNew()
    }

    /**
     * @param {Event} event
     */
    #handleTimeUpdate(event) {
      const time = event.detail.minutesSecondsString
      this.#timeDisplayElement.setTime(time)

      this.#timeDisplayElement.setTimerStatus(this.#intervalTimer.isWorkTime())

      this.#timeDisplayElement.setSetsStatus(this.#intervalTimer.getCurrentSet(), this.#intervalTimer.getSets())
    }

    /**
     * @param {Event} event
     */
    #handleTimeExpired(event) {
      const time = event.detail.minutesSecondsString
      this.#timeDisplayElement.setTime(time)
      this.#timeDisplayElement.setTimerStatus(this.#intervalTimer.isWorkTime(), this.#intervalTimer.isExpired())
      this.#timeDisplayElement.setSetsStatus(this.#intervalTimer.getCurrentSet(), this.#intervalTimer.getSets())
    }

    #updateComponentVisability() {
      this.#timeDisplayElement.classList.toggle('hidden')
      this.#controlsElement.classList.toggle('hidden')
      this.#setupElement.classList.toggle('hidden')
    }
  }
)
