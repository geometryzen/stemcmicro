import { check } from "../src/check";

xdescribe("erfc", function () {
    it("001", function () {
        check("erfc(1.0)", "0.157299...");
    });
});
