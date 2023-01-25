"use strict";

const { unlink } = require("fs");

/**
 * Removes any leftover latest screenshots or diffs.
 *
 * @param {String} latestPath Path to the latest saved screenshot.
 * @param {String} diffPath Path to the saved diff screenshot.
 * @return {Promise} A promise that resolves successfully once the images are removed
 */
module.exports = function cleanupScreenshots(latestPath, diffPath) {
	return new Promise((resolve) => {
		unlink(latestPath, () => {
			unlink(diffPath, () => {
				resolve(true);
			});
		});
	});
};
