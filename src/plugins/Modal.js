import Plugin from './Plugin'
import Utils from '../core/Utils'

/**
 * Modal
 *
 */
export default class Modal extends Plugin {
  constructor (core, opts) {
    super(core, opts)
    this.type = 'view'

    // set default options
    const defaultOptions = {
      defaultTabIcon: `
        <svg class="UppyModalTab-icon" width="28" height="28" viewBox="0 0 101 58" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.582.3L.915 41.713l32.94 13.295L17.582.3zm83.333 41.414L67.975 55.01 84.25.3l16.665 41.414zm-48.998 5.403L63.443 35.59H38.386l11.527 11.526v5.905l-3.063 3.32 1.474 1.36 2.59-2.806 2.59 2.807 1.475-1.357-3.064-3.32v-5.906zm16.06-26.702c-3.973 0-7.194-3.22-7.194-7.193 0-3.973 3.222-7.193 7.193-7.193 3.974 0 7.193 3.22 7.193 7.19 0 3.974-3.22 7.194-7.195 7.194zM70.48 8.682c-.737 0-1.336.6-1.336 1.337 0 .736.6 1.335 1.337 1.335.738 0 1.338-.598 1.338-1.336 0-.74-.6-1.338-1.338-1.338zM33.855 20.415c-3.973 0-7.193-3.22-7.193-7.193 0-3.973 3.22-7.193 7.195-7.193 3.973 0 7.192 3.22 7.192 7.19 0 3.974-3.22 7.194-7.192 7.194zM36.36 8.682c-.737 0-1.336.6-1.336 1.337 0 .736.6 1.335 1.337 1.335.738 0 1.338-.598 1.338-1.336 0-.74-.598-1.338-1.337-1.338z"/>
        </svg>
      `,
      panelSelectorPrefix: 'UppyModalContent-panel'
    }

    this.isModalVisible = false

    // merge default options with the ones set by user
    this.opts = Object.assign({}, defaultOptions, opts)

    this.initEvents = this.initEvents.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.showModal = this.showModal.bind(this)
    this.install = this.install.bind(this)
  }

  prepareTarget (callerPlugin) {
    const callerPluginId = callerPlugin.constructor.name
    const callerPluginName = callerPlugin.name || callerPluginId
    const callerPluginIcon = callerPlugin.icon || this.opts.defaultTabIcon

    switch (callerPlugin.type) {
      case 'progress':
        return '.UppyModal-progressContainer'
      case 'selecter':

        // add tab panel, where plugin will render
        const modalContent = document.querySelector('.UppyModalContent')
        const nodeForPlugin = document.createElement('div')

        modalContent.appendChild(nodeForPlugin)
        nodeForPlugin.outerHTML = `
        <div class="UppyModalContent-panel ${this.opts.panelSelectorPrefix}--${callerPluginId}"
             role="tabpanel">
        </div>
        `

        // add tab switch button
        const modalTabs = document.querySelector('.UppyModalTabs')
        const modalTab = document.createElement('div')

        modalTabs.appendChild(modalTab)
        modalTab.outerHTML = `
          <li class="UppyModalTab">
            <button class="UppyModalTab-btn"
                    role="tab"
                    aria-controls="${callerPluginId}"
                    data-open="${this.opts.panelSelectorPrefix}--${callerPluginId}">
              ${callerPluginIcon}
              <span class="UppyModalTab-name">${callerPluginName}</span>
            </button>
          </li>
        `

        this.initEvents()

        return `.${this.opts.panelSelectorPrefix}--${callerPluginId}`
      default:
        let msg = 'Error: Modal can only be used by plugins of types: selecter, progress'
        this.core.log(msg)
        break
    }
  }

  render () {
    // http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog

    return `
      <div class="UppyModal"
           aria-hidden="true"
           aria-labelledby="modalTitle"
           aria-describedby="modalDescription"
           role="dialog">
        <div class="UppyModal-overlay js-UppyModal-close" tabindex="-1"></div>
        <div class="UppyModal-inner">
          <button class="UppyModal-close js-UppyModal-close" title="Close uploader modal" data-modal-hide>×</button>

          <ul class="UppyModalTabs" role="tablist"></ul>
          <div class="UppyModalContent">
            <div class="UppyModal-progressContainer">progress here</div>
          </div>
        </div>
      </div>
    `
  }

  hideModal () {
    this.isModalVisible = false
    this.modalEl.setAttribute('aria-hidden', 'true')
  }

  showModal () {
    this.isModalVisible = true
    this.modalEl.removeAttribute('aria-hidden')
  }

  hideAllTabPanels () {
    this.tabPanels.forEach(tabPanel => {
      tabPanel.style.display = 'none'
    })
  }

  showTabPanel (id) {
    const tabPanel = document.querySelector(`.${id}`)
    tabPanel.style.display = 'block'
  }

  initEvents () {
    const tabs = Utils.qsa('.UppyModalTab-btn')
    this.tabPanels = []
    tabs.forEach(tab => {
      const tabId = tab.getAttribute('data-open')
      const tabPanel = document.querySelector(`.${tabId}`)
      this.tabPanels.push(tabPanel)

      tab.addEventListener('click', event => {
        event.preventDefault()
        tabs.forEach(tab => tab.classList.remove('is-selected'))
        console.log(tabId)
        tab.classList.add('is-selected')
        // this.core.getPlugin(tabId.substr(1)).focus()
        this.hideAllTabPanels()
        this.showTabPanel(tabId)
      })
    })

    this.hideAllTabPanels()
  }

  install () {
    document.body.addEventListener('keyup', event => {
      if (event.keyCode === 27) {
        this.hideModal()
      }
    })

    const node = document.createElement('div')
    document.body.appendChild(node)
    node.outerHTML = this.render()
    this.modalEl = document.querySelector('.UppyModal')

    // Add events for opening and closing the modal
    const hideModalTrigger = Utils.qsa('.js-UppyModal-close')
    const showModalTrigger = document.querySelector(this.opts.trigger)

    hideModalTrigger.forEach(trigger => trigger.addEventListener('click', this.hideModal))
    showModalTrigger.addEventListener('click', this.showModal)

    this.initEvents()
  }
}
