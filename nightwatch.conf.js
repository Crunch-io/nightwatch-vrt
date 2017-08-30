'use strict'

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const seleniumStandAlone = require('selenium-standalone');

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const REPORTS_PATH = path.join(__dirname, 'reports', 'e2e');
const SCREENSHOT_PATH = path.join(__dirname, 'reports', 'screenshots');
const BINPATH = path.join(__dirname, 'node_modules', 'nightwatch', 'bin');

const SELENIUM_VERSION = '3.5.2'; // https://selenium-release.storage.googleapis.com/index.html
const SELENIUM_PATH = path.join(BINPATH, 'selenium-server', SELENIUM_VERSION + '-' + 'server.jar');
const CHROME_DRIVER_VERSION = '2.31'; // https://chromedriver.storage.googleapis.com/index.html
const CHROME_PATH = path.join(BINPATH, 'chromedriver', CHROME_DRIVER_VERSION + '-' + process.arch + '-' + 'chromedriver');
const IE_DRIVER_VERSION = SELENIUM_VERSION; // https://selenium-release.storage.googleapis.com/index.html
const GECKO_DRIVER_VERSION = '0.18.0'; // https://github.com/mozilla/geckodriver/releases
const GECKO_PATH = path.join(BINPATH, 'geckodriver', GECKO_DRIVER_VERSION + '-' + process.arch + '-' + 'geckodriver');
const GHOST_DRIVER_VERSION = '2.1.0'; // https://github.com/detro/ghostdriver/releases
const GHOST_PATH = '2.1.0';
const PHANTOMJS_PATH = path.join(__dirname, 'node_modules', 'phantomjs-prebuilt', 'bin', 'phantomjs');

function defaultScreenshotPath(nightwatchClient, basePath, fileName) {
    return path.join(
        nightwatchClient.options.screenshotsPath || basePath || ('reports/screenshots'),
        nightwatchClient.options.desiredCapabilities.platform || 'ANY',
        (nightwatchClient.options.desiredCapabilities.browserName || 'UNKNOWN'),
        (nightwatchClient.options.desiredCapabilities.version || 'UNKNOWN'),
        nightwatchClient.currentTest.name,
        fileName.replace(/ /g, '_')
    );
}

module.exports = {
    "src_folders": [
        "e2e"
    ],
    "custom_commands_path": [
        "./commands"
    ],
    "custom_assertions_path": [
        "./assertions"
    ],
    "output_folder": REPORTS_PATH,
    "selenium": {
        "start_process": true,
        "server_path": SELENIUM_PATH,
        "host": "127.0.0.1",
        "port": 4444,
        "cli_args": {
            "webdriver.chrome.driver": CHROME_PATH,
            "webdriver.gecko.driver": GECKO_PATH,
            "webdriver.ghost.driver": GHOST_PATH
        }
    },
    "test_settings": {
        "default": {
            "silent": true,
            "visual_regression_settings": {
                "generate_screenshot_path": defaultScreenshotPath,
                //"latest_screenshots_path": '',
                "latest_suffix": '.latest',
                //"baseline_screenshots_path": '',
                "baseline_suffix": '.baseline',
                //"diff_screenshots_path": ''
                "diff_suffix": '.diff',
                "prompt": true,
                "always_save_diff_screenshot": false
            },
            "screenshots": {
                "enabled": true,
                "path": SCREENSHOT_PATH,
                "on_failure": false,
                "on_error": false
            },
            "globals": {
                "prompt": DEVELOPMENT,
                "waitForConditionTimeout": 5000
            },
            "desiredCapabilities": {
                "platform": "LINUX",
                "version": "latest",
                "browserName": "phantomjs"
            }
        },
        "phantomjs": {
            "desiredCapabilities": {
                "browserName": "phantomjs",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "phantomjs.binary.path": PHANTOMJS_PATH,
                "phantomjs.cli.args": []
            }
        },
        "chrome": {
            "desiredCapabilities": {
                "browserName": "chrome",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "chromeOptions": {
                    "args": ["--start-fullscreen"]
                }
            }
        },
        "firefox": {
            "desiredCapabilities": {
                "browserName": "firefox",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "marionette": true,
            }
        }
    }
}

fs.stat(SELENIUM_PATH, function(err, stat) {
    if (err || !stat || stat.size < 1) {
        rimraf(path.join(BINPATH, 'chromedriver'), function(rmerr) {
            if (rmerr) throw new Error(rmerr);
            seleniumStandAlone.install({
                basePath: BINPATH,
                version: SELENIUM_VERSION,
                baseURL: 'https://selenium-release.storage.googleapis.com',
                drivers: {
                    chrome: {
                        version: CHROME_DRIVER_VERSION,
                        arch: process.arch,
                        baseURL: 'https://chromedriver.storage.googleapis.com'
                    },
                    ie: {
                        version: IE_DRIVER_VERSION,
                        arch: process.arch,
                        baseURL: 'https://selenium-release.storage.googleapis.com'
                    },
                    firefox: {
                        version: GECKO_DRIVER_VERSION,
                        arch: process.arch,
                        baseURL: 'https://github.com/mozilla/geckodriver/releases/download'
                    }
                },
                logger: function(message) {},
                progressCb: function(totalLength, progressLength, chunkLength) {}
            }, function(error, child) {
                if (error) throw new Error(error);
                console.log(' \x1b[32m✔\x1b[0m Drivers downloaded to:', BINPATH);
            });
        })
    }
});
