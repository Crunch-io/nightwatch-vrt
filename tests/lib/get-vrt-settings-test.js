'use strict'

const getVrtSettings = require('../../lib/get-vrt-settings'),
    defaultSettings = {
        latest_screenshots_path: 'vrt/latest',
        latest_suffix: '',
        baseline_screenshots_path: 'vrt/baseline',
        baseline_suffix: '',
        diff_screenshots_path: 'vrt/diff',
        diff_suffix: '',
        threshold: 0.0,
        prompt: false,
        always_save_diff_screenshot: false
    }

describe('getVrtSettings', () => {
    function getNightwatchClient(customSettings = {}) {
        return {
            assert: {
                ok: jest.fn()
            }
        }
    }

    describe('when getting visual regression settings', () => {

        describe('given no visual regression settings defined', () => {
            it('should return default settings', () => {
                const nightwatchClient = getNightwatchClient()
                const settings = getVrtSettings(nightwatchClient)

                expect(settings).toEqual(defaultSettings)
            })
        })

        describe('given visual regression settings are defined in the nightwatch globals settings section', () => {

            it('should return the defined settings', () => {
                const nightwatchClient = getNightwatchClient()
                const vrtSettings = {
                    threshold: 0.2,
                    diff_screenshots_path: 'vrt/custom-diffs'
                }

                nightwatchClient.globals = {
                    visual_regression_settings: vrtSettings
                }

                const settings = getVrtSettings(nightwatchClient)
                expect(settings).toMatchObject(vrtSettings)
            })
        })

        describe('given visual regression settings are defined in the nightwatch globals settings section within a test_settings object', () => {

            it('should return the defined settings', () => {
                const nightwatchClient = getNightwatchClient()
                const vrtSettings = {
                    threshold: 0.2,
                    diff_screenshots_path: 'vrt/custom-diffs'
                }

                nightwatchClient.globals = {
                    test_settings: { visual_regression_settings: vrtSettings }
                }

                const settings = getVrtSettings(nightwatchClient)
                expect(settings).toMatchObject(vrtSettings)
            })
        })

        describe('given partial test-scoped visual regression settings defined', () => {
            it('should return default settings', () => {
                const nightwatchClient = getNightwatchClient()
                const settings = getVrtSettings(nightwatchClient, {threshold: 0.5})
                const modifiedSettings = Object.assign({}, defaultSettings, {threshold: 0.5})

                expect(settings).toEqual(modifiedSettings)
            })
        })

    })
})
