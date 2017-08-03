'use strict'

/**
 * Saves a screenshot image to disk.
 *
 * @param {Object} nightwatchClient Instance of the current nightwatch API interface.
 * @param {String} path The file path where the screenshot image will be saved.
 * @param {Object} screenshot Jimp image representation of the screenshot to be stored
 * @param {String} message Optional log message describing the screenshot being saved.
 *
 * @return {Promise} a promise that resolves successfully if the screenshot was saved.
 * A rejected promise indicates failure.
 */
module.exports = function saveScreenshot(nightwatchClient, path, screenshot, message) {

    nightwatchClient.assert.ok(true, message)

    return new Promise((resolve, reject) => {
        screenshot.write(path, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(screenshot)
            }
        })
    })
}
