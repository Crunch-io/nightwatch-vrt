"use strict";

const promisifyCommand = require("../../lib/promisify-command");

describe("promisifyCommand", () => {
	function getNightwatchAPI() {
		return {
			"result": { "status": 0, "value": "" },
			"calls": [],
			elementId(selector, callback = () => false) {
				this.calls.push([selector]);
				callback(this.result);
			}
		};
	}

	it("should resolve the promise when command result status equals 0", (done) => {
		const nightwatchAPI = getNightwatchAPI();

		promisifyCommand(nightwatchAPI, "elementId", [".selector"]).then(
			(result) => {
				expect(result).toEqual(nightwatchAPI.result.value);
				done();
			}
		);
	});

	it("should reject the promise when command result status is not equal to 0", (done) => {
		const nightwatchAPI = getNightwatchAPI();

		nightwatchAPI.result.status = 9;
		nightwatchAPI.result.state = "invalid call";

		promisifyCommand(nightwatchAPI, "elementId", [".selector"]).catch(
			(result) => {
				expect(result).toEqual(nightwatchAPI.result.state);
				done();
			}
		);
	});
});
