import { check } from "../src/check";

describe("besselj", function () {
    it("001", function () {
        check("besselj(0,0)", "1");
    });
});
