'use strict'

const compareWithBaseline = require('../lib/compare-with-baseline')

/**
 * Asserts if a screenshot that captures the visual representation of
 * an element in the application is identical to a previously captured
 * screenshot used as a baseline.
 *
 * When this assertion is executed and the baseline screenshot doesn't exist,
 * it will save the captured screenshot as the baseline and the assertion will succeed.
 *
 * The baseline screenshot will be saved in the baseline directory passed in
 * the settings here, or the directory specified in the nightwatch configuration
 * (under test_settings/visual_regression), or in a default generated path; in
 * that order. Further assertions will compare against the screenshot that was
 * saved in the first execution of the assertion.
 *
 * @param {String} selector Identifies the element that will be captured in the screenshot.
 * @param {String} fileName Optional file name for this screenshot; defaults to the selector
 * @param {NightwatchVRTOptions} settings Optional settings to override the defaults and `visual_regression_settings`
 * @param {String} message Optional message for `nightwatch` to log upon completion
 */
exports.assertion = function screenshotIdenticalToBaseline(
    elementId,
    fileName = elementId,
    settings,
    message
) {

    this.message = message || `Visual regression test results for element <${elementId}>.`
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
                compareWithBaseline(this.api, screenshot, fileName, settings).then(callback)
            })

        return this
    }
}
