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
    function getNightwatchClient() {
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
