'use strict'

const kebabCase = require('lodash/kebabCase')
const path = require('path')

/**
 * Generates a screenshot file path based on the following information extracted
 * from the nightwatch public interface:
 *
 * 1. Name of the current test running in the node process.
 * 2. The current test's module.
 * 3. A base path.
 *
 * @param {Object} nightwatchClient Instance of the current nightwatch API interface
 * @param {String} basePath A custom string that can be specified to further distinguish
 * the location where the screenshot will be stored or read from.
 */
module.exports = function generateScreenshotFilePath(nightwatchClient, basePath) {
    const moduleName = nightwatchClient.currentTest.module,
        testName = nightwatchClient.currentTest.name,
        kebabName = `${kebabCase(testName)}.png`

    return path.join(process.cwd(), basePath, moduleName, kebabName)
}
