'use strict'

const getVrtSettings = require('../../lib/get-vrt-settings')

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

            it('should indicate that visual regression settings were not found', () => {
                const nightwatchClient = getNightwatchClient()
                const settings = getVrtSettings(nightwatchClient)
                const calls = nightwatchClient.assert.ok.mock.calls

                expect(calls.length).toEqual(1)
                expect(calls[0]).toEqual([
                    null,
                    'Could not access the visual regression settings. Make sure you define a visual_regression_settings property in your nightwatch configuration file.'
                ])
            })
        })

        describe('given visual regression settings defined but baseline_screenshot_path property is not', () => {

            it('should indicate the setting is missing', () => {
                const nightwatchClient = getNightwatchClient()

                nightwatchClient.globals = {
                    test_settings: {
                        visual_regression_settings: {}
                    }
                }

                const settings = getVrtSettings(nightwatchClient)
                const calls = nightwatchClient.assert.ok.mock.calls
                expect(calls[0]).toEqual([
                    false,
                    'You must define a baseline screenshot directory path.'
                ])
            })
        })

        describe('given visual regression settings defined but failed_screenshots_path property is not', () => {

            it('should indicate the setting is missing', () => {
                const nightwatchClient = getNightwatchClient()

                nightwatchClient.globals = {
                    test_settings: {
                        visual_regression_settings: {}
                    }
                }

                const settings = getVrtSettings(nightwatchClient)
                const calls = nightwatchClient.assert.ok.mock.calls
                expect(calls[1]).toEqual([
                    false,
                    'You must define a diff screenshot directory path.'
                ])
            })
        })
    })
})