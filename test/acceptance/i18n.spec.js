var test = require('tape')
var chalk = require('chalk')
var Driver = require('./Driver')
var setSauceTestStatus = Driver.setSauceTestStatus
var setSauceTestName = Driver.setSauceTestName
var collectErrors = Driver.collectErrors

module.exports = function (driver, platform, host) {
  var testName = 'i18n: make sure Uppy loads with Russian language pack '
  var platformName = chalk.underline.yellow('[' +
      platform.os + ' ' +
      platform.browser + ' ' +
      platform.version +
    ']')

  test(testName + ' ' + platformName, function (t) {
    t.plan(1)

    driver.get(host + '/examples/i18n')
    driver.manage().window().maximize()

    setSauceTestName(driver, testName)

    function findLabelTextElement () {
      return driver.findElements({css: '.UppyDragDrop-label'}).then(function (result) {
        return result[0]
      })
    }

    driver.wait(findLabelTextElement, 8000, 'Uppy should load within 8 seconds')
      .then(function (element) {
        element.getText().then(function (value) {
          collectErrors(driver).then(function () {
            // why trim? Microsoft Edge:
            // not ok 4 should be equal
            //  ---
            // operator: equal
            // expected: 'Выберите файл или перенесите его сюда'
            // actual:   'Выберите файл или перенесите его сюда '
            t.equal(value.trim(), 'Выберите файл или перенесите его сюда')
            if (value.trim() === 'Выберите файл или перенесите его сюда') {
              setSauceTestStatus(driver, true)
            } else {
              setSauceTestStatus(driver, false)
            }
            driver.quit()
          })
        })
      })
      .catch(function (err) {
        collectErrors(driver).then(function () {
          t.fail(err)
          setSauceTestStatus(driver, false)
          driver.quit()
        })
      })
  })
}
