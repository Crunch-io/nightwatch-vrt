'use strict'

const saveScreenshot = require('./save-screenshot'),
    fs = require('fs'),
    Jimp = require('jimp')

/**
 * Retrieves the baseline screenshot for the running test. If the baseline
 * does not exist, it will create one with the screenshot passed as the second
 * parameter.
 *
 * @param {Object} screenshot Jimp image representation. Represents a screenshot that
 * will be used as the baseline if a baseline hasn't been saved for the current test.
 * @param {Object} baselinePath Jimp image representation. Represents a screenshot that
 * will be used as the baseline if a baseline hasn't been saved for the current test.
 *
 * @return {Promise} A promise that resolves with the baseline screenshot
 */
module.exports = function getBaselineScreenshotOrCreate(
    nightwatchClient,
    screenshot,
    baselinePath
) {
    return new Promise((resolve, reject) => {
        fs.stat(baselinePath, (err, stat) => {
            if (!err && stat.isFile()) {
                Jimp.read(baselinePath).then(resolve, reject)
            } else {
                nightwatchClient.assert.ok(true, 'Baseline screenshot does not exist; saving current screenshot to the baseline directory.') // eslint-disable-line max-len
                saveScreenshot(
                    baselinePath,
                    screenshot
                )
                    .then(resolve)
                    .catch((error) => reject(error))
            }
        })
    })
}
