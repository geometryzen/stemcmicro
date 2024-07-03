import { check } from "../src/check";

describe("erfc", function () {
    it("001", function () {
        check("erfc(1.0)", "0.157299...");
    });
});
