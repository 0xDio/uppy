import html from 'yo-yo'
import { fileIcon, checkIcon, removeIcon } from './icons'

module.exports = function drawerItem (bus, file) {
  const isUploaded = file.progress === 100

  const remove = (ev) => {
    bus.emit('file-remove', file.id)
  }

  return html`<li class="UppyDashboardItem"
                  id="${file.id}"
                  title="${file.name}">
    <div class="UppyDashboardItem-icon">
      ${file.type.general === 'image' ? file.previewEl : fileIcon(file.type)}
    </div>
    <h4 class="UppyDashboardItem-name">
      ${file.uploadURL
        ? html`<a href="${file.uploadURL}" target="_blank">${file.name}</a>`
        : html`<span>${file.name}</span>`
      }
      <br>
    </h4>
    <h5 class="UppyDashboardItem-status">
      ${file.progress > 0 && file.progress < 100 ? 'Uploading… ' + file.progress + '%' : ''}
      ${file.progress === 100 ? 'Completed' : ''}
    </h5>
    ${isUploaded
      ? checkIcon
      : html`<button class="UppyDashboardItem-remove"
                     aria-label="Remove this file"
                     onclick=${remove}>
                ${removeIcon}
             </button>`
    }
    <div class="UppyDashboardItem-progress"
         style="width: ${file.progress}%"></div>
  </li>`
}
