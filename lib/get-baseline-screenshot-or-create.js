'use strict'

const generateScreenshotFilePath = require('./generate-screenshot-file-path'),
    saveScreenshot = require('./save-screenshot'),
    fs = require('fs'),
    Jimp = require('jimp'),
    getVrtSettings = require('./get-vrt-settings')


/**
 * Retrieves the baseline screenshot for the running test. If the baseline
 * does not exist, it will create one with the screenshot passed as the second
 * parameter.
 * 
 * @param {Object} nightwatchClient Instance of the current nightwatch API interface
 * @param {Object} screenshot Jimp image representation. Represents a screenshot that
 * will be used as the baseline if a baseline hasn't been saved for the current test.
 * 
 * @return {Promise} A promise that resolves with the baseline screenshot
 */
module.exports = function getBaselineScreenshotOrCreate(nightwatchClient, screenshot) {
    const { baseline_screenshots_path } = getVrtSettings(nightwatchClient)

    return new Promise((resolve, reject) => {
        const baselinePath = generateScreenshotFilePath(nightwatchClient, baseline_screenshots_path)

        fs.stat(baselinePath, (err, stat) => {
            if (!err && stat.isFile()) {
                Jimp.read(baselinePath).then(resolve, reject)
            } else {
                saveScreenshot(nightwatchClient, baselinePath, screenshot, 'baseline screenshot does not exist. saving current screenshot to the baseline directory.')
                    .then(resolve, reject)
            }
        })
    })

}
