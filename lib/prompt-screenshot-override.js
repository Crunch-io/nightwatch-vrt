'use strict'

const readline = require('readline')

const GREEN = '\x1b[32m',
    RED = '\x1b[31m',
    YELLOW = '\x1b[33m',
    BLUE = '\x1b[34m',
    RESET = '\x1b[0m',
    BRIGHT = '\x1b[1m'

function error_screenshots_differ(latestPath, expectedPath, diffPath) {
    return `\
 ${RED}✗${RESET} Latest screenshot does not match baseline
 ${RED}├${RESET}     ${RED}Latest${RESET}: file://${latestPath.replace(/ /g, '%20')}
 ${RED}├${RESET}   ${GREEN}Expected${RESET}: file://${expectedPath.replace(/ /g, '%20')}
 ${RED}└${RESET} ${YELLOW}Difference${RESET}: file://${diffPath.replace(/ /g, '%20')}
 ${BLUE}?${RESET} Override baseline? ${BRIGHT}(y,N)${RESET} `
}

/**
 * Queries the user to override the baseline screenshot and logging the file paths
 * for quick and easy analysis.
 *
 * @param {String} latestPath Path to the latest saved screenshot.
 * @param {String} expectedPath Path to the saved baseline screenshot.
 * @param {String} diffPath Path to the saved diff screenshot.
 * @return {Promise} A promise that resolves successfully if the user agrees to
 * override, or false otherwise. Default response is no.
 */
module.exports = function promptScreenshotOverride(
    latestPath,
    expectedPath,
    diffPath
) {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl.question(
            error_screenshots_differ(latestPath, expectedPath, diffPath),
            (response) => {
                if (response.toUpperCase().includes('Y')) {
                    rl.close()
                    resolve(true)
                } else {
                    rl.close()
                    reject(new Error('User refused to override baseline'))
                }
            }
        )
    })
}
