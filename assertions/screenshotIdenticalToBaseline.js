'use strict'

const compareWithBaseline = require('../lib/compare-with-baseline')

/**
 * Asserts if a screenshot that captures the visual representation of
 * an element in the application is identical to a previously captured
 * screenshot used as a baseline.
 *
 * When this assertion is executed and the baseline screenshot doesn't exists,
 * it will use save captured screenshot as the baseline and the assertion will succeed.
 *
 * The baseline screenshot will be saved in the baseline directory passed in
 * the settings here, or the directory specified in the nightwatch configuration
 * (under test_settings/visual_regression), or in a default generated path; in
 * that order. Further assertions will compare against the screenshot that was
 * saved in the first execution of the assertion.
 *
 * @param {String} elementId Selector that identifies the Element that will be captured
 * in the screenshot.
 * @param {String} fileName Optional fileName to save as; defaults to elementId
 * @param {NightwatchVRTOptions} settings Optional nightwatch-vrt settings; these override what is found under test_settings
 * @param {String} message Optional message to log
 */
exports.assertion = function screenshotIdenticalToBaseline(
    elementId,
    fileName = elementId,
    settings,
    msg
) {

    this.message = msg || `Visual regression test results for element <${elementId}>.`
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
