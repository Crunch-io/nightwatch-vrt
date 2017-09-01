'use strict'

const generateScreenshotFilePath = require('../../lib/generate-screenshot-file-path')

describe('generateScreenshotFilePath', () => {
    function getNightwatchClient() {
        return {
            currentTest: {
                module: 'visualizations',
                name: 'barPlots'
            }
        }
    }

    it('should generate a file path by using the basePath parameter, and the current test name and module', () => {
        expect(generateScreenshotFilePath(getNightwatchClient(), 'baseline'))
            .toEqual(`${process.cwd()}/baseline/visualizations/bar-plots`)
    })
})
