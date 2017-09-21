'use strict'

const EventEmitter = require('events').EventEmitter,
    util = require('util'),
    Jimp = require('jimp'),
    Buffer = require('buffer').Buffer,
    promisifyCommand = require('../lib/promisify-command')

/**
 * Takes a screenshot of the visible region encompassed by the bounding rectangle
 * of an element.
*
 * @link
 * @param {string} id ID of the element to route the command to.
 * @param {function} callback Callback function which is called with the captured screenshot as an argument.
 * @returns {Object} The captured screenshot. This object is a Jimp (library) image instance.
 */
function CaptureElementScreenshot() {
    EventEmitter.call(this)
}

util.inherits(CaptureElementScreenshot, EventEmitter)

CaptureElementScreenshot.prototype.command = function command(
    selector,
    callback = () => {} // eslint-disable-line no-empty-function
) {
    const api = this.client.api

    Promise.all([
        promisifyCommand(api, 'getLocationInView', [selector]),
        promisifyCommand(api, 'getElementSize', [selector]),
        promisifyCommand(api, 'screenshot', [false])
    ]).then(([location, size, screenshotEncoded]) => {
        const { x, y } = location
        let { width, height } = size

        if (width === 0 || height === 0) {
            this.client.assertion(
                false,
                null,
                null,
                `The element identified by the selector <${selector}> is not visible or its dimensions equals 0. width: ${width}, height: ${height}`, // eslint-disable-line max-len
                true
            )
        }

        Jimp.read(new Buffer(screenshotEncoded, 'base64')).then((screenshot) => {
            /**
             * https://www.w3.org/TR/webdriver/#take-screenshot
             * "The Take Screenshot command takes a screenshot of the top-level browsing context’s viewport."
             *
             * If the target element extends outside of the viewport, the expected
             * dimentions will exceed the actual dimensions, resulting in a
             * "RangeError: out of range index" exception (from Buffer)
             */
            if (height < screenshot.bitmap.height) {
                height = screenshot.bitmap.height
            }

            if (width < screenshot.bitmap.width) {
                width = screenshot.bitmap.width
            }

            screenshot.crop(x, y, width, height)
            this.client.assertion(
                true,
                null,
                null,
                `The screenshot for selector <${selector}> was captured successfully.`,
                true
            )

            callback(screenshot)
            this.emit('complete', screenshot)
        })
    }).catch((errorMessage) => {
        this.client.assertion(
            false,
            'success',
            errorMessage,
            `The screenshot for selector <${selector}> could not be captured.`
        )
        this.emit('complete', errorMessage, this)
    })
}

module.exports = CaptureElementScreenshot
