import Uppy from 'uppy/core'
import { Dummy, DragDrop, GoogleDrive, Modal, ProgressBar, Present, Tus10 } from 'uppy/plugins'
import ProgressDrawer from '../../../../src/plugins/ProgressDrawer.js'

const uppy = new Uppy({debug: true, autoProceed: false})
uppy
  .use(Modal, {trigger: '#uppyModalOpener'})
  // .use(ProgressBar, {target: Modal})
  .use(DragDrop, {target: Modal})
  // .use(GoogleDrive, {target: Modal})
  .use(Dummy, {target: Modal})
  // .use(Present, {target: Modal})
  .use(Tus10, {endpoint: 'http://master.tus.io:3020/files/'})
  .use(ProgressDrawer, {target: Modal})
  .run()
