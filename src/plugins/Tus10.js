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
    this.core.log(`uploading ${current} of ${total}`)

    // Create a new tus upload
    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file.data, {

        // TODO merge this.opts or this.opts.tus here
        resume: false,
        endpoint: this.opts.endpoint,
        onError: (error) => {
          reject('Failed because: ' + error)
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          let percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
          percentage = Math.round(percentage)

          // Dispatch progress event
          this.core.emitter.emit('upload-progress', {
            uploader: this,
            id: file.id,
            percentage: percentage,
            done: false
          })
          this.core.log(file)
        },
        onSuccess: () => {
          this.core.emitter.emit('upload-success', file)

          this.core.log(`Download ${upload.file.name} from ${upload.url}`)
          resolve(upload)
        }
      })
      upload.start()
    })
  }

  install () {
    this.core.emitter.on('next', () => {
      this.core.log('Tus is uploading..')
      const selectedFiles = this.core.state.selectedFiles
      const uploaders = []

      Object.keys(selectedFiles).forEach((fileID, i) => {
        const file = selectedFiles[fileID]
        const current = parseInt(i, 10) + 1
        const total = Object.keys(selectedFiles).length
        uploaders.push(this.upload(file, current, total))
      })

      Promise.all(uploaders).then((result) => {
        this.core.log('Tus has finished uploading!')
      })
    })
  }

/**
 * Add files to an array of `upload()` calles, passing the current and total file count numbers
 *
 * @param {Array | Object} results
 * @returns {Promise} of parallel uploads `Promise.all(uploaders)`
 */
  run (results) {
    this.core.log({
      class: this.constructor.name,
      method: 'run',
      results: results
    })

    const files = results

    // var uploaded  = [];
    const uploaders = []
    for (let i in files) {
      const file = files[i]
      const current = parseInt(i, 10) + 1
      const total = files.length
      uploaders.push(this.upload(file, current, total))
    }

    return Promise.all(uploaders).then(() => {
      return {
        uploadedCount: files.length
      }
    })

    // return Promise.all(uploaders)
  }
}
