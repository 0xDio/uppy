// Docs aren't that great to find. Mostly JAVA based. Here are few helpful resources:
// - https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs
// - http://seleniumhq.github.io/selenium/docs/api/javascript/
// - http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/firefox/index.html

var test = require('tape')
var path = require('path')
var chalk = require('chalk')
var webdriver = require('selenium-webdriver')
var firefox = require('selenium-webdriver/firefox')
var By = webdriver.By

var profile = new firefox.Profile()
profile.addExtension(path.join(__dirname, 'xpi', 'firebug-2.0.16.xpi'))
profile.addExtension(path.join(__dirname, 'xpi', 'JSErrorCollector.xpi'))
profile.setPreference('extensions.firebug.showChromeErrors', true)

var options = new firefox.Options().setProfile(profile)
var driver = new firefox.Driver(options)

// A remote driver could look something like this:
// var driver = new (require('selenium-webdriver')).Builder()
//   .forBrowser('firefox')
//   .usingServer('http://127.0.0.1:4444/wd/hub')
//   .setFirefoxOptions(options)
//   .build()

var hexoServer = 'http://localhost:4000'

test('make sure Uppy loads with Russion language pack', function (t) {
  driver.get(hexoServer + '/examples/i18n/')

  // Monitor for errors, and dump them
  const promise = driver.executeScript('return window.JSErrorCollector_errors.pump()')
  promise.then(function (errors) {
    if (!errors || !errors.length) {
      return
    }
    errors.forEach(function (error) {
      console.error([
        '[browser-error]',
        chalk.magenta(error.sourceName),
        chalk.dim('#' + error.lineNumber),
        chalk.red(error.errorMessage)
      ].join(' '))
    })
  })

  // Our success/fail message will be logged in the console element
  var consoleElement = driver.findElement(By.id('console-log'))

  // Wait for our upload message to be logged
  driver.wait(isLoaded.bind(this, consoleElement))

  // Get the result of our upload and test it
  getElementValue(consoleElement)
    .then(function (value) {
      var result = value.split('\n')[0]
      t.equal(result, '--> Uppy Bundled version with Tus10 & Russian language pack has loaded')
    })

  driver.quit()

  t.end()

  /**
   * Check if uploading is finished by looking for a result message
   * in the example's console output element.
   * @return {Boolean} If uploading is complete
   */
  function isLoaded (consoleElement) {
    return getElementValue(consoleElement)
      .then(function (value) {
        return value.indexOf('-->') !== -1
      })
  }

  /**
   * Get value attribute of element
   * @param  {webdriver.WebElement} element Selenium element object
   * @return {webdriver.promise} Promise resolving to element value
   */
  function getElementValue (element) {
    return element.getAttribute('value')
      .then(function (value) {
        return value
      })
  }
})
