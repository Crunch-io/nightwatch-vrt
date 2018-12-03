'use strict'

const generateScreenshotFilePath = require('../../lib/generate-screenshot-file-path')
const path = require('path')

describe('generateScreenshotFilePath', () => {
    let customNameFn

    function getNightwatchClient() {
        return {
            currentTest: {
                module: 'visualizations',
                name: 'barPlots'
            },
            globals: {
                test_settings: {
                    visual_regression_settings: {
                        generate_screenshot_path: customNameFn
                    }
                }
            }
        }
    }

    it('should generate a file path by using the basePath parameter, and the current test name and module', () => {
        expect(generateScreenshotFilePath(getNightwatchClient(), 'baseline'))
            .toEqual(`${process.cwd()}\\baseline\\visualizations\\bar-plots.png`)
    })

    it('should generate a file path by using the basePath parameter, and a custom filename', () => {
        expect(generateScreenshotFilePath(getNightwatchClient(), 'baseline', 'foo-test'))
            .toEqual(`${process.cwd()}\\baseline\\visualizations\\foo-test.png`)
    })

    it('should pass the correct filename to the custom naming function', () => {
        customNameFn = (client, basePath, fileName) =>
            path.join(process.cwd(), basePath, client.currentTest.module, `custom-${fileName}`)

        expect(generateScreenshotFilePath(getNightwatchClient(), 'baseline', 'foo-test'))
            .toEqual(`${process.cwd()}\\baseline\\visualizations\\custom-foo-test.png`)
    })
})
