import Plugin from './Plugin'

/**
 * Dummy
 *
 */
export default class Dummy extends Plugin {
  constructor (core, opts) {
    super(core, opts)
    this.type = 'selecter'

    // set default options
    const defaultOptions = {}

    // merge default options with the ones set by user
    this.opts = Object.assign({}, defaultOptions, opts)
  }

  render () {
    return `
      <div class="wow-this-works">
        I am a dummy plugin, look at me, I was rendered in a modal! That’s crazy, I know.
      </div>
    `
  }

  install () {
    // this.core.log('the spinner target is... ' +
    //   this.getTarget(this.opts.target).spinner
    // )
    const caller = this
    this.target = this.getTarget(this.opts.target, caller)
    this.target.innerHTML = this.render()
    return
  }
}
