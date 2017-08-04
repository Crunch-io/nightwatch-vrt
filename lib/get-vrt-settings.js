'use strict'

const assert = require('assert'),
    get = require('lodash/get')

/**
 * Get the visual regression tests settings from the nightwatch configuration file.
 *
 * @param {Object} nightwatchClient Instance of the current nightwatch API interface.
 *
 * @return {Object} An object containing the visual regression test settings.
 */
module.exports = function getVrtSettings(nightwatchClient) {
    const visualRegressionSettings = get(
        nightwatchClient,
        'globals.test_settings.visual_regression_settings',
        null
    )

    if (visualRegressionSettings) {
         nightwatchClient.assert.ok(
            typeof(get(visualRegressionSettings, 'baseline_screenshots_path', null)) === 'string',
            'You must define a baseline screenshot directory path.'
        )
        nightwatchClient.assert.ok(
            typeof(get(visualRegressionSettings, 'failed_screenshots_path', null)) === 'string',
            'You must define a failed screenshot directory path.'
        )
    } else {
        nightwatchClient.assert.ok(
            visualRegressionSettings,
            'Could not access the visual regression settings. Make sure you define a visual_regression_settings property in your nightwatch configuration file.'
        )
    }


    return visualRegressionSettings
}
