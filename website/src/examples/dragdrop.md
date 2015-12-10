---
title: DragDrop
type: examples
order: 2
---

> Drag & Drop

<!-- Playground styles -->
<link rel="stylesheet" href="dragdrop/static/css/style.css">

<!-- Basic Uppy styles -->
<link rel="stylesheet" href="dragdrop/static/css/uppy.css">

<form id="upload-target" class="UppyDragDrop" method="post" action="/" enctype="multipart/form-data">
  <svg class="UppyDragDrop-puppy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" enable-background="new 0 0 100 100"><path d="M16.582 21.3L-.085 62.713l32.94 13.295zM99.915 62.714L66.975 76.01 83.25 21.3zM50.917 68.117L62.443 56.59H37.386l11.527 11.526v5.905l-3.063 3.32 1.474 1.36 2.59-2.807 2.59 2.807 1.475-1.358-3.063-3.32zM66.976 41.415c-3.972 0-7.193-3.22-7.193-7.193 0-3.973 3.222-7.193 7.193-7.193 3.974 0 7.193 3.22 7.193 7.192 0 3.973-3.22 7.193-7.194 7.193m2.506-11.732c-.738 0-1.337.6-1.337 1.337s.6 1.336 1.337 1.336 1.337-.598 1.337-1.336-.6-1.337-1.338-1.337zM32.854 41.415c-3.973 0-7.193-3.22-7.193-7.193 0-3.973 3.22-7.193 7.194-7.193 3.973 0 7.192 3.22 7.192 7.192 0 3.973-3.22 7.193-7.192 7.193m2.506-11.732c-.738 0-1.337.6-1.337 1.337s.6 1.336 1.337 1.336 1.337-.598 1.337-1.336-.598-1.337-1.337-1.337z"/></svg>
  <div>
    <input id="UppyDragDrop-input" class="UppyDragDrop-input" type="file" name="files[]" data-multiple-caption="{count} files selected" multiple />
    <label class="UppyDragDrop-label" for="UppyDragDrop-input"><strong>Choose a file</strong><span class="UppyDragDrop-dragText"> or drag it here</span>.</label>
    <!-- <button class="UppyDragDrop-btn" type="submit">Upload</button> -->
  </div>
  <div class="UppyDragDrop-status"></div>
</form>

<small>Puppy icon by Jorge Fernandez del Castillo Gomez <br>from the Noun Project</small>

<!-- Include the bundled app.js client -->
<script src="dragdrop/static/js/app.js"></script>

<!-- <script src="uppy.js"></script>

<script>
  var uppy = new Uppy({wait: false});
  console.log(uppy);
  var files = uppy
    .use(DragDrop, {selector: '#upload-target'})
    .use(Tus10, {endpoint: 'http://master.tus.io:8080'})
    .run();
</script> -->

<!-- <script src="static/js/app.js"></script> -->
