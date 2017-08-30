'use strict'

const Jimp = require('jimp'),
    getBaselineScreenshotOrCreate = require('./get-baseline-screenshot-or-create'),
    saveScreenshot = require('./save-screenshot'),
    generateScreenshotFilePath = require('./generate-screenshot-file-path'),
    getVrtSettings = require('./get-vrt-settings'),
    promptScreenshotOverride = require('./prompt-screenshot-override'),
    overrideBaseline = require('./override-baseline'),
    cleanupScreenshots = require('./cleanup-screenshots')

/**
 * Compares a screenshot against the baseline screenshot. If the baseline screenshot
 * does not exist in the baseline directory, this function creates it and compares the screenshot
 * passed as parameter against itself.
 *
 * @param {Object} nightwatchClient Instance of the current nightwatch API interface
 * @param {Object} screenshot Jimp image representation
 * @param {Object} fileName Optional file name
 * @param {Object} overrideSettings Optional override settings
 */
module.exports = function compareWithBaseline(
    nightwatchClient,
    screenshot,
    fileName,
    overrideSettings
) {
    const {
            latest_screenshots_path,
            latest_suffix,
            baseline_screenshots_path,
            baseline_suffix,
            diff_screenshots_path,
            diff_suffix,
            prompt,
            threshold,
            always_save_diff_screenshot
        } = getVrtSettings(nightwatchClient, overrideSettings),
        completeLatestPath = generateScreenshotFilePath(
            nightwatchClient,
            latest_screenshots_path,
            fileName + latest_suffix + '.png'
        ),
        completeBaselinePath = generateScreenshotFilePath(
            nightwatchClient,
            baseline_screenshots_path,
            fileName + baseline_suffix + '.png'
        ),
        completeDiffPath = generateScreenshotFilePath(
            nightwatchClient,
            diff_screenshots_path,
            fileName + diff_suffix + '.png'
        )

    return new Promise((resolve, reject) => {
        getBaselineScreenshotOrCreate(
            nightwatchClient,
            screenshot,
            completeBaselinePath
        ).then((baseline) => {
            const diff = Jimp.diff(screenshot, baseline),
                identical = diff.percent <= (Number.isFinite(threshold) ? threshold : 0.0)

            if (!identical && prompt === true) {
                saveScreenshot(
                    completeLatestPath,
                    screenshot
                )
                    .then(() => saveScreenshot(
                        completeDiffPath,
                        diff.image
                    ))
                    .then(() => promptScreenshotOverride(
                        completeLatestPath,
                        completeBaselinePath,
                        completeDiffPath
                    ))
                    .then(() => {
                        nightwatchClient.assert.ok(true, 'User granted overriding baseline screenshot.') // eslint-disable-line max-len

                        return overrideBaseline(
                            completeLatestPath,
                            completeBaselinePath
                        )
                    })
                    .then(() => cleanupScreenshots(
                        completeLatestPath,
                        completeDiffPath
                    ))
                    .then(
                        resolve
                    )
                    .catch(() => {
                        resolve(false)
                    })
            } else if (!identical || always_save_diff_screenshot === true) {
                nightwatchClient.assert.ok(true, 'Settings enforced overriding baseline screenshot.') // eslint-disable-line max-len
                saveScreenshot(
                    completeBaselinePath,
                    screenshot
                )
                    .then(() => {
                        resolve(true)
                    })
                    .catch(() => resolve(false))
            } else if (identical) {
                // Cleanup here in case user fixed bug and reran tests
                cleanupScreenshots(
                    completeLatestPath,
                    completeDiffPath
                )
                    .then(
                        () => {
                            resolve(identical)
                        }
                    )
            } else {
                resolve(identical)
            }
        }, reject)
    })
}
