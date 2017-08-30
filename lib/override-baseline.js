'use strict'

const { rename } = require('fs')

/**
 * Overrides the baseline screenshot with the latest
 *
 * @param {String} latestPath Path to the latest saved screenshot.
 * @param {String} baselinePath Path to the saved diff screenshot.
 * @return {Promise} A promise that resolves successfully once the baseline has
 * been overridden.
 */
module.exports = function overrideBaseline(
    latestPath,
    baselinePath
) {
    return new Promise((resolve) => {
        rename(
            latestPath,
            baselinePath,
            (error) => {
                if (error) {
                    throw new Error(error)
                }

                resolve(true)
            }
        )
    })
}
