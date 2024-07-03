import { check } from "../src/check";

describe("sin", function () {
    it("001", function () {
        check("sin(pi/4)", "1/2**(1/2)");
    });
});
