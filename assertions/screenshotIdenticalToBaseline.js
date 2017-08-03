'use strict'

const compareWithBaseline = require('../lib/compare-with-baseline')

/**
 * Asserts if a screenshot that captures the visual representation of
 * an element in the application is identical to a previously captured
 * screenshot used as a baseline.
 *
 * When this assertion is executed and the baseline screenshot doesn't exists,
 * it'll use the captured screenshot as a baseline and the assertion will succeed.
 *
 * The baseline screenshot will be saved in the baseline directory specified in the
 * nightwatch configuration using. Further assertions will compare against the
 * screenshot that was saved in the first execution of the assertion.
 *
 * @param {String} elementId Selector that identifies the Element that will be captured
 * in the screenshot.
 */
exports.assertion = function screenshotIdenticalToBaseline(elementId, msg) {

    this.message = msg || `Testing if screenshot for element ${elementId} is identical.`
    this.expected = true

    this.pass = function pass(value) {
        return value === this.expected
    }

    this.value = function value(result) {
        return result
    }

    this.command = function command(callback) {

        this
            .api
            .waitForElementVisible(elementId, 5000)
            .captureElementScreenshot(elementId, (screenshot) => {
                compareWithBaseline(this.api, screenshot).then(callback)
            })

        return this
    }
}
