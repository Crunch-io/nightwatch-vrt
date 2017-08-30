'use strict'

/**
 * Saves a screenshot image to disk.
 *
 * @param {String} path The file path where the screenshot image will be saved.
 * @param {Object} screenshot Jimp image representation of the screenshot to be stored
 *
 * @return {Promise} a promise that resolves successfully if the screenshot was saved.
 * A rejected promise indicates failure.
 */
module.exports = function saveScreenshot(path, screenshot) {
    return new Promise((resolve) => {
        screenshot.write(path, (error) => {
            if (error) {
                throw new Error(error)
            } else {
                resolve(screenshot)
            }
        })
    })
}
