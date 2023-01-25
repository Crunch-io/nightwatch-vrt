"use strict";

/**
 * Wraps a nightwatch api command in a promise
 *
 * @param {Object} api Reference to the nightwatch api object
 * @param {String} commandName Name of the api command to execute
 * @param {Array} args Command args
 *
 * @return {Promise}
 */
module.exports = function promisifyCommand(api, commandName, args = []) {
	return new Promise((resolve, reject) => {
		api[commandName](
			...args.concat((result) => {
				if (result.status === 0) {
					resolve(result.value);
				} else {
					reject(result.state);
				}
			})
		);
	});
};
