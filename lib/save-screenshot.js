'use strict'

/**
 * Saves a screenshot image on disk.
 *
 * @param {Object} nightwatchClient Instance of the current nightwatch API interface
 * @param {String} path The file path where the screenshot image will be saved.
 * @param {Object} screenshot Jimp image representation where the screenshot to be saved
 * is stored.
 * @param {String} message Optional message that will be displayed to indicate in the test
 * logs what kind of screenshot is being saved.
 *
 * @return {Promise} a promise that resolves successfully if the screenshot was saved.
 * It'll be rejected otherwise.
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
