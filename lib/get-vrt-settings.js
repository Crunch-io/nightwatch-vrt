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

    assert.ok(
        visualRegressionSettings,
        'Could not access to visual regression settings. Make sure you define a visual_regression_settings property in your nightwatch configuration file.'
    )

    assert.ok(typeof visualRegressionSettings.baseline_screenshots_path === 'string', 'You should define a baseline screenshot directory path')
    assert.ok(typeof visualRegressionSettings.failed_screenshots_path === 'string', 'You should define a baseline screenshot directory path')

    return visualRegressionSettings
}
