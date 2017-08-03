'use strict'

const EventEmitter = require('events').EventEmitter,
    util = require('util'),
    Jimp = require('jimp'),
    Buffer = require('buffer').Buffer

/**
 * Takes a screenshot of the visible region encompassed by the bounding rectangle
 * of an element.
*
 * @link
 * @param {string} id ID of the element to route the command to.
 * @param {function} callback Callback function which is called with the screenshot captured.

 * @returns {Object} The screenshot captured. This object is an instance of the Jimp library.
 */
function CaptureElementScreenshot() {
    EventEmitter.call(this)
}

util.inherits(CaptureElementScreenshot, EventEmitter)

CaptureElementScreenshot.prototype.command = function command(selector, callback = () => {}) {
    const api = this.client.api

    Promise.all([
        promisifyCommand(api, 'getLocationInView', [selector]),
        promisifyCommand(api, 'getElementSize', [selector]),
        promisifyCommand(api, 'screenshot', [false])
    ]).then(([location, size, screenshotEncoded]) => {
        const { x, y } = location,
            { width, height } = size

        Jimp.read(new Buffer(screenshotEncoded, 'base64')).then((screenshot) => {
            screenshot.crop(x, y, width, height)
            this.client.assertion(
                true,
                null,
                null,
                `The screenshot for selector ${selector} was captured successfully.`,
                true
            )

            callback(screenshot)
            this.emit('complete', screenshot)
        })
    })
        .catch((errorMessage) => {
            this.client.assertion(
                false,
                'success',
                errorMessage,
                `The screenshot for selector ${selector} could not be captured.`
            )
            this.emit('complete', errorMessage, this)
        })
}

function promisifyCommand(api, commandName, args = []) {
    return new Promise((resolve, reject) => {
        api[commandName](...args.concat((result) => {
            if (result.status === 0) {
                resolve(result.value)
            } else {
                reject(result.state)
            }
        }))
    })
}

module.exports = CaptureElementScreenshot
