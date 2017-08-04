# Nightwatch VRT

Nightwatch Visual Regression Testing tools for nightwatch.js

## Description

Nightwatch VRT extends [nightwatch.js](http://nightwatchjs.org/) with an assertion that captures a screenshot of a DOM element identified by a selector and compares the screenshot against a baseline screenshot. If the baseline screenshot does not exist, it will be created the first time you run the test and the assertion will pass.

## Configuration

In order to use nightwatch-vrt, you should include the following sections in your nightwatch [configuration file](http://nightwatchjs.org/gettingstarted#settings-file)

#### Custom commands and assertions

Register nightwatch-vrt's assertion and commands:

```JavaScript
    custom_commands_path: [
        'node_modules/nightwatch-vrt/commands'
    ],
    custom_assertions_path: [
        'node_modules/nightwatch-vrt/assertions'
    ]
```

#### Nightwatch vrt custom settings

Add nightwatch-vrt settings to nightwatch's [`test_settings`](http://nightwatchjs.org/gettingstarted#test-settings) section

```JavaScript
visual_regression_settings: {
    baseline_screenshots_path: 'vrt/baseline',
    diff_screenshots_path: 'vrt/diff'
}
```

These settings indicate where the baseline and diff screenshots should be stored.

## Usage

In order to use nightwatch-vrt, you only need to invoke the `screenshotIdenticalToBaseline` assertion and pass a css selector for the DOM element to compare.


```JavaScript
'use strict'

module.exports = {

    'Test crunch.io main content is correct': (browser) => {

        browser
            .url('https://crunch.io')
            .assert.screenshotIdenticalToBaseline('.body.entry-content')
            .end()
    }
}
```

The first time a test is run, a baseline screenshot will be created and stored on disk. You should always register the baseline screenshot in the code repository. Further executions of this test will compare against this baseline.
