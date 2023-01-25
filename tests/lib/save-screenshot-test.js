"use strict";

const saveScreenshot = require("../../lib/save-screenshot");

describe("saveScreenshot", () => {
	function getNightwatchClient() {
		return {
			"assert": {
				"ok": jest.fn()
			}
		};
	}

	function getImage() {
		return {
			"write": jest.fn()
		};
	}

	it("should write the screenshot file in the file path specified", () => {
		const filePath = "filePath";
		const message = "This is the message";
		const image = getImage();
		const client = getNightwatchClient();

		saveScreenshot(filePath, image).then((savedScreenshot) => {
			expect(image.write.mock.calls[0]).toEqual([filePath, savedScreenshot]);
		});
	});
});
