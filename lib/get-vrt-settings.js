'use strict'

const get = require('lodash/get')

/**
 * Get the visual regression tests settings from the nightwatch configuration file.
 *
 * @param {Object} nightwatchClient Instance of the current nightwatch API interface.
 * @param {Object} overrideSettings Optional override settings.
 * @return {NightwatchVRTSettings} An object containing the visual regression test settings.
 */
module.exports = function getVrtSettings(nightwatchClient, overrideSettings) {
    return Object.assign(
        {
            baseline_screenshots_path: 'vrt/baseline',
            baseline_suffix: '',
            latest_screenshots_path: 'vrt/latest',
            latest_suffix: '',
            diff_screenshots_path: 'vrt/diff',
            diff_suffix: '',
            threshold: 0.0,
            prompt: false,
            always_save_diff_screenshot: false
        },
        get(
            nightwatchClient,
            'globals.test_settings.visual_regression_settings',
            null
        ),
        overrideSettings
    )
}
