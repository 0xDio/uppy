Our combined changelog and todo. Items can be tagged by owner and optionally, if discussion
happened / is needed, a GitHub issue.

Please add your entries in the form of:

 - `- [ ] (<plugin name>|website|core|meta): <Present tense verb> <subject> \(<list of associated owners/gh-issues>\)`.

## TODO

Work not started yet

- [ ] modal: Add basic Modal plugin that can be used as a target
- [ ] google: Add basic Google Drive plugin example
- [ ] instagram: Add basic Instagram plugin example (#21)
- [ ] presets: Add basic preset that mimics Transloadit's jQuery plugin (#28)
- [ ] tus: Add support tus 1.0 uploading capabilities (#3)
- [ ] core: Apply plugins when DOM elements aren't static (#25)
- [ ] core: Create a progressbar/spinner/etc plugin (#18)
- [ ] multipart: Write an acceptance test for the Multipart example via Saucelabs (#2, #23, @hedgerh)
- [ ] test: setup an HTML page with all sorts of crazy styles, resets & bootstrap to see what brakes Uppy

## 0.0.2 (Unreleased, work in progress)

- [ ] core: Decide on good names for `cdn` vs `npm` builds and rename all-the-things
- [ ] server: Add a deploy target for uppy-server so we can use it in demos (#39, @kvz)
- [ ] server: Create a (barely) working uppy-server (#39, @hedgerh)
- [ ] dragdrop: Use templates, autoUpload setting, show progress
- [X] meta: Implement playground to test things in, templates in this case
- [X] core: Implement ejs or es6 templating (@arturi, @hedgerh)
- [ ] core: Improve on `_i18n` support, add tests (#47, @arturi)
- [X] buildsystem: Use parallelshell and tweak browserify to work with templates (@arturi)
- [X] docs: Fix build-documentation.js crashes, add more docs to Utils and Translator (@arturi, @kvz)
- [X] core: Integrate eslint in our build procedure and make Travis fail on errors found in our examples, Core and Plugins, such as `> 100` char lines (@kvz)
- [X] core: Add basic i18n support via `core.translate()` and locale loading (#47, @arturi)
- [X] website: Fix Uppy deploys (postcss-svg problem) (@arturi, @kvz)
- [ ] meta: Create an Uppy logo (@vvolfy)

## 0.0.1 (December 20, 2015)

- [x] dragdrop: Add basic DragDrop plugin example (#7)
- [x] dropbox: Add basic Dropbox plugin example (#31)
- [x] website: Add CSS Framework (#14)
- [x] website: Create Hexo site that also contains our playground (#5, #34, #12 #22, #44, #35, #15, #37, #40, #43)
- [x] core: Individual progress (#24)
- [x] core: Setup basic Plugin system (#1, #4, #20)
- [x] core: Setup build System (#30, #13, @hedgerh)
