import Plugin from './Plugin'
import tus from 'tus-js-client'

/**
 * Tus resumable file uploader
 *
 */
export default class Tus10 extends Plugin {
  constructor (core, opts) {
    super(core, opts)
    this.type = 'uploader'

    // set default options
    const defaultOptions = {}

    // merge default options with the ones set by user
    this.opts = Object.assign({}, defaultOptions, opts)
  }

/**
 * Create a new Tus upload
 *
 * @param {object} file for use with upload
 * @param {integer} current file in a queue
 * @param {integer} total number of files in a queue
 * @returns {Promise}
 */
  upload (file, current, total) {
    console.log(`uploading ${current} of ${total}`)

    // Create a new tus upload
    const upload = new tus.Upload(file, {
      endpoint: this.opts.endpoint,
      onError: error => {
        return Promise.reject('Failed because: ' + error)
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        let percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
        percentage = Math.round(percentage)
        // self.setProgress(percentage, current, total)

        // Dispatch progress event
        this.core.emitter.emit('progress', {
          plugin: this,
          percentage: percentage
        })
      },
      onSuccess: () => {
        console.log(`Download ${upload.file.name} from ${upload.url}`)
        return Promise.resolve(upload)
      }
    })
    // Start the upload
    upload.start()
  }

/**
 * Add files to an array of `upload()` calles, passing the current and total file count numbers
 *
 * @param {Array | Object} results
 * @returns {Promise} of parallel uploads `Promise.all(uploaders)`
 */
  run (results) {
    console.log({
      class: this.constructor.name,
      method: 'run',
      results: results
    })

    const files = this.extractFiles(results)

    this.core.log('tus got this: ')
    this.core.log(results)

    // this.setProgress(0)

    // var uploaded  = [];
    const uploaders = []
    for (let i in files) {
      const file = files[i]
      const current = parseInt(i, 10) + 1
      const total = files.length
      uploaders.push(this.upload(file, current, total))
    }

    return Promise.all(uploaders)
  }
}
