const generateScreenshotFilePath = require('../../lib/generate-screenshot-file-path')
const path = require('path')
const set = require('lodash/set')

describe('generateScreenshotFilePath', () => {
    function getNightwatchClient() {
        return {
            currentTest: {
                module: 'visualizations',
                name: 'barPlots'
            },
            globals: {
                visual_regression_settings: {},
                test_settings: { visual_regression_settings: {} }
            }
        }
    }

    it('should generate a file path by using the basePath parameter, and the current test name and module', () => {
        expect(generateScreenshotFilePath(getNightwatchClient(), 'baseline'))
            .toEqual(`${process.cwd()}/baseline/visualizations/bar-plots.png`)
    })

    it('should generate a file path by using the basePath parameter, and a custom filename', () => {
        expect(generateScreenshotFilePath(getNightwatchClient(), 'baseline', 'foo-test'))
            .toEqual(`${process.cwd()}/baseline/visualizations/foo-test.png`)
    })

    it('should pass the correct filename to the custom naming function', () => {
        const nightwatchClient = getNightwatchClient()
        const testFn = jest.fn((client, basePath, fileName) =>
            path.join(process.cwd(), basePath, client.currentTest.module, `test-setting-custom-${fileName}`))

        set(nightwatchClient, 'globals.test_settings.visual_regression_settings.generate_screenshot_path', testFn)

        const result = generateScreenshotFilePath(nightwatchClient, 'baseline', 'foo-test')

        expect(testFn).toHaveBeenCalled()
        expect(result)
            .toEqual(`${process.cwd()}/baseline/visualizations/test-setting-custom-foo-test.png`)
    })

    it('should use the base global setting for generate_screenshot_path if a test_setting exists', () => {
        const nightwatchClient = getNightwatchClient()
        const testFn = jest.fn((client, basePath, fileName) =>
            path.join(process.cwd(), basePath, client.currentTest.module, `test-setting-custom-${fileName}`))

        set(nightwatchClient, 'globals.test_settings.visual_regression_settings.generate_screenshot_path', testFn)
        
        const customFn = jest.fn((client, basePath, fileName) =>
            path.join(process.cwd(), basePath, client.currentTest.module, `custom-${fileName}`))

        set(nightwatchClient, 'globals.visual_regression_settings.generate_screenshot_path', customFn)
        set(nightwatchClient, 'globals.test_settings.visual_regression_settings.generate_screenshot_path', testFn)

        const result = generateScreenshotFilePath(nightwatchClient, 'baseline', 'foo-test')

        expect(result, 'baseline', 'foo-test')
            .toEqual(`${process.cwd()}/baseline/visualizations/custom-foo-test.png`)
    })
})
