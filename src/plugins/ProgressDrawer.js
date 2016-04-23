import Plugin from './Plugin'
import yo from 'yo-yo'

/**
 * Progress drawer
 *
 */
export default class ProgressDrawer extends Plugin {
  constructor (core, opts) {
    super(core, opts)
    this.name = 'Progress Drawer'
    this.type = 'progressindicator'

    // set default options
    const defaultOptions = {}

    // merge default options with the ones set by user
    this.opts = Object.assign({}, defaultOptions, opts)
  }

  drawerItem (file) {
    const isUploaded = file.progress === 100

    const remove = (ev) => {
      this.core.emitter.emit('file-remove', file.id)
    }

    const checkIcon = yo`<svg class="UppyProgressDrawer-itemCheck" width="16" height="16" viewBox="0 0 32 32" enable-background="new 0 0 32 32">
        <polygon points="2.836,14.708 5.665,11.878 13.415,19.628 26.334,6.712 29.164,9.54 13.415,25.288 "></polygon>
      </svg>`

    return yo`<li id="${file.id}" class="UppyProgressDrawer-item"
                  title="${file.name}">
      <div class="UppyProgressDrawer-itemInfo">
        ${file.type.general === 'bla'
          ? yo`<img class="UppyProgressDrawer-itemIcon" alt="${file.name}" src="${file.preview}">`
          : yo`<span class="UppyProgressDrawer-itemType">${file.type.specific}</span>`
        }
      </div>
      <div class="UppyProgressDrawer-itemInner">
        <span class="UppyProgressDrawer-itemProgress"
              style="width: ${file.progress}%"></span>
        <h4 class="UppyProgressDrawer-itemName">
          ${file.uploadURL
            ? yo`<a href="${file.uploadURL}" target="_blank">${file.name}</a>`
            : yo`<span>${file.name} (${file.progress}%)</span>`
          }
        </h4>
          ${isUploaded ? checkIcon : ''}
          ${isUploaded
            ? ''
            : yo`<button class="UppyProgressDrawer-itemRemove" onclick=${remove}>×</button>`
          }
      </div>
    </li>`
  }

  render (state) {
    const files = state.files

    const selectedFiles = Object.keys(files).filter((file) => {
      return files[file].progress !== 100
    })

    const uploadedFiles = Object.keys(files).filter((file) => {
      return files[file].progress === 100
    })

    const selectedFileCount = Object.keys(selectedFiles).length
    const uploadedFileCount = Object.keys(uploadedFiles).length

    const isSomethingSelected = selectedFileCount > 0
    const isSomethingUploaded = uploadedFileCount > 0
    const isSomethingSelectedOrUploaded = isSomethingSelected || isSomethingUploaded

    const autoProceed = this.core.opts.autoProceed

    const next = (ev) => {
      this.core.emitter.emit('next')
    }

    return yo`<div class="UppyProgressDrawer ${isSomethingSelectedOrUploaded ? 'is-visible' : ''}">
      <div class="UppyProgressDrawer-status">
        ${isSomethingSelected ? this.core.i18n('filesChosen', {'smart_count': selectedFileCount}) : ''}
        ${isSomethingSelected && isSomethingUploaded ? ', ' : ''}
        ${isSomethingUploaded ? this.core.i18n('filesUploaded', {'smart_count': uploadedFileCount}) : ''}
      </div>
      <ul class="UppyProgressDrawer-list">
        ${Object.keys(files).map((fileID) => {
          return this.drawerItem(files[fileID])
        })}
      </ul>
      ${autoProceed
        ? ''
        : yo`<button class="UppyProgressDrawer-upload ${isSomethingSelected ? 'is-active' : ''}"
                     type="button" onclick=${next}>
          ${isSomethingSelected
            ? this.core.i18n('uploadFiles', {'smart_count': selectedFileCount})
            : this.core.i18n('selectToUpload')
          }
        </button>`
      }
    </div>`
  }

  install () {
    this.el = this.render(this.core.state)
    this.target = this.getTarget(this.opts.target, this, this.el, this.render.bind(this))
  }
}
