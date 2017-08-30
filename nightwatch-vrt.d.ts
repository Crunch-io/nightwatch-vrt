interface NightwatchVRTSettings {
  "baseline_screenshots_path"?: string;
  "baseline_suffix"?: string;
  "latest_screenshots_path"?: string;
  "latest_suffix"?: string;
  "diff_screenshots_path"?: string;
  "diff_suffix"?: string;
  "threshold"?: number;
  "screenshotPath": (browser: NightwatchAPI) => string;
  "prompt"?: boolean;
}

interface NightwatchAssertions {
    /**
     * Asserts if a screenshot that captures the visual representation of
     * an element in the application is identical to a previously captured
     * screenshot used as a baseline.
     *
     * When this assertion is executed and the baseline screenshot doesn't exists,
     * it will use save captured screenshot as the baseline and the assertion will succeed.
     *
     * The baseline screenshot will be saved in the baseline directory passed in
     * the settings, or the directory specified in the nightwatch configuration
     * (under test_settings/visual_regression_settings), or in a default generated path; in
     * that order. Further assertions will compare against the screenshot that was
     * saved in the first execution of the assertion.
     *
     * @param {String} elementId Selector that identifies the Element that will be captured
     * in the screenshot.
     * @param {String} fileName Optional fileName to save as; defaults to elementId
     * @param {NightwatchVRTOptions} settings Optional nightwatch-vrt settings; these override what is found under test_settings
     * @param {String} message Optional message to log
     */
    screenshotIdenticalToBaseline: (elementId: string, fileName?: string, options?: NightwatchVRTSettings, message?: string) => this;
}

interface NightwatchAPI {
    /**
     * Takes a screenshot of the visible region encompassed by the bounding rectangle
     * of an element.
    *
     * @link
     * @param {string} elementId ID of the element to route the command to.
     * @param {function} callback Callback function which is called with the captured screenshot as an argument.
     * @returns {Object} The captured screenshot. This object is a Jimp (library) image instance.
     */
    captureElementScreenshot: (elementId: string, callback?: (arg?: any) => void) => this
}
