'use strict'

module.exports = {
    'Render test': function (browser) {
        browser
            .url('http://localhost:8080/demo2/')
            .waitForElementVisible('body', 1000)
            .resizeWindow(1024, 768)
            .assert.screenshotIdenticalToBaseline('body h1')
            .end()
    }
}
